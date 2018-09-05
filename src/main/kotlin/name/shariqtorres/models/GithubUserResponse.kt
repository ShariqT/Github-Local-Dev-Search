package name.shariqtorres.models


import org.json.JSONArray
import java.util.concurrent.ThreadLocalRandom

class GithubUserResponse(var items:JSONArray){
    public var userlist: MutableList<GithubUser>  = mutableListOf()

    init{
        for (i in 0 until this.items.length() - 1){
            val user = this.items.getJSONObject(i)
            this.userlist.add(GithubUser("",
                    user["login"].toString(),
                    user["avatar_url"].toString(),
                    ""
                    ))
        }
    }

    private fun random(range:IntRange):Int{
        return ThreadLocalRandom.current().nextInt(range.first, range.endInclusive);
    }

    public fun getRandomUser():GithubUser{
        val randomIndex = this.random(0..this.items.length() - 1)
        return this.userlist[randomIndex]
    }

}