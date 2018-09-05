package name.shariqtorres.resources
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.PropertyAccessor
import com.fasterxml.jackson.databind.ObjectMapper
import name.shariqtorres.models.GithubRepo
import name.shariqtorres.models.GithubUser
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType
import name.shariqtorres.services.GithubService
import org.json.JSONObject
import javax.ws.rs.core.NewCookie
import javax.ws.rs.core.Response
import javax.ws.rs.core.UriBuilder

@Path("/oauth")
class AuthResources(val g:GithubService){

    @Path("/")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun authorize(@QueryParam("code") code:String): Response{

        val retMap:String? =  this.g.getAccessToken(code)
        var cookie = NewCookie("access_token", retMap);
        var uri = UriBuilder.fromPath("/").build()
        return Response.seeOther(uri).cookie(cookie).build()
    }

    @Path("/profile")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun userInfo(@QueryParam("access_token") token:String?) : GithubUser?{
        if(token == null){
            return null
        }

        var info = this.g.getUserInfo(token)
        if(info == null){
            return null;
        }
        return info;

    }

    @Path("/login/url")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun getUrl(): Map<String, String>{
        return mapOf<String, String>("url" to this.g.getSignInURL());
    }



    @Path("/search")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun searchUsers(@QueryParam("location") location:String,
                    @QueryParam("access_token") token:String,
                    @QueryParam("lang") lang:String): MutableMap<String, Any?>{
        var info = this.g.searchByLocation(token, lang, location );
        println(location)
        var repos: MutableList<GithubRepo> = arrayListOf()
        if (info != null){
            repos = this.g.getUserRepos(info.login, lang, token);
        }

        if (repos.size == 0){
            // there are no repos for that user, got to find another and start over
           info = this.g.searchByLocation(token, lang, location);
            repos = arrayListOf();
            if (info != null){
                repos = this.g.getUserRepos(info.login, lang, token);
            }

        }

        return mutableMapOf("user" to info, "repos" to repos)
    }


    @Path("/repos")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun searchRepos(@QueryParam("access_token") token:String,
                    @QueryParam("username") username:String,
                    @QueryParam("lang") lang:String): MutableList<GithubRepo>?{
        return this.g.getUserRepos(username, lang, token)
    }
}