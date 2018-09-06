package name.shariqtorres.services
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.PropertyAccessor
import com.fasterxml.jackson.databind.ObjectMapper
import khttp.get
import khttp.post
import khttp.responses.Response
import name.shariqtorres.models.GithubUser
import name.shariqtorres.models.GithubUserResponse
import name.shariqtorres.models.GithubRepo
import org.json.JSONArray
import java.net.URLEncoder
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Callable

class GithubService(val client_id:String, val client_secret:String, val baseURL:String = "https://api.github.com"){

    fun getScopes(): String{
        return "read:user"
    }


    fun asyncTask(runnable:Response): Response{
        val myService:ExecutorService = Executors.newFixedThreadPool(2)
        val result = myService.submit(Callable<Response> {
            runnable;
        })
        return result.get()

    }
    fun getSignInURL(): String{
        val params:Map<String, String> = mapOf("client_id" to this.client_id, "scope" to this.getScopes())
        var req:Response = this.asyncTask( get("https://github.com/login/oauth/authorize", params=params ) )

        return req.url
    }

    fun getUserInfo(token:String ): GithubUser?{
        var params: Map<String, String> = mapOf("access_token" to token)
        var headers: Map<String, String> = mapOf("Accepts" to "application/json")
        val req = this.asyncTask(get(this.baseURL + "/user", headers=headers, params=params))
        if(req.statusCode != 200){
            return null
        }else{
            val user = GithubUser(req.jsonObject["name"].toString(),
                    req.jsonObject["login"].toString(),
                    req.jsonObject["avatar_url"].toString(),
                    req.jsonObject["location"].toString())

            return user;
        }
    }

    fun searchByLocation(token:String, projectLang:String, location:String): GithubUser?{
        var objmapper = ObjectMapper();
        objmapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
        var urlString = this.baseURL + "/search/users?location=" + URLEncoder.encode(location, "utf-8") + "&access_token=" + token +"&q=language:" + URLEncoder.encode(projectLang, "utf-8");
        val req = this.asyncTask(get(urlString));
        if(req.statusCode != 200){
            return null
            // this means that we can't complete the next query to get the repos...
        }else{
            val headers = req.headers;
            var linkHeader = headers["Link"]!!.split(";")
            if(linkHeader.size > 0){
                val start = this.getPage(linkHeader[0])
                val end = this.getPage(linkHeader[1])
                val newPage = (start until end).shuffled().last()
                val res2 = this.asyncTask(get(urlString + "&page=" + newPage))
                if(res2.statusCode != 200){
                    return null
                    // this means we can't get the next query to get the repos...
                }else{
                    print(res2.jsonObject.toString())
                    val response= res2.jsonObject.getJSONArray("items")
                    val res = GithubUserResponse(response)
                    return res.getRandomUser();
                }

            }
            return null
        }
    }

    fun getUserRepos(username:String, language:String, access_token:String): MutableList<GithubRepo>{
        var urlString = this.baseURL + "/search/repositories?access_token=" + access_token
        urlString = urlString + "&q=language:" + URLEncoder.encode(language, "utf-8") + "+user:" + URLEncoder.encode(username, "utf-8");
        val res = this.asyncTask(get(urlString));
        println(urlString)
        var data: MutableList<GithubRepo> = mutableListOf();
        val items:JSONArray = res.jsonObject.getJSONArray("items")
        if(items.length() == 0){
            return arrayListOf();
        }

        if(items.length() > 3){
            for (i in 0 until 3){
                val i = items.getJSONObject(i);
                data.add(GithubRepo(
                        i["name"].toString(),
                        i["full_name"].toString(),
                        i["description"].toString(),
                        i["updated_at"].toString()
                ))
            }
        }
        if( items.length() <= 3) {
            for (i in 0 until items.length() - 1) {
                val i = items.getJSONObject(i)
                data.add(GithubRepo(
                        i["name"].toString(),
                        i["full_name"].toString(),
                        i["description"].toString(),
                        i["updated_at"].toString()
                ))
            }
        }

        return data;
    }

    fun getPage(link:String):Int{
        var linkSize = link.length
        var firstLink = link.slice(1..linkSize - 2)
        var linkParts = firstLink.split("&")
        var pageParts = linkParts[ linkParts.size - 1 ].split("=")
        return pageParts[1].toInt()
    }

    fun getAccessToken(code:String): String?{
        var data:MutableMap<String, String> = mutableMapOf()
        data.put("code", code)
        data.put("client_id", this.client_id)
        data.put("client_secret", this.client_secret)
        var headers:Map<String, String> = mapOf("Accept" to "application/json")

        var res = this.asyncTask(post("https://github.com/login/oauth/access_token", headers=headers, data = data))
        if (res.statusCode == 200){
            return res.jsonObject["access_token"].toString()
        }else {
            return null;
        }
    }
}