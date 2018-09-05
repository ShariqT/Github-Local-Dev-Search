package name.shariqtorres.resources
import javax.ws.rs.GET
import javax.ws.rs.Path
import name.shariqtorres.services.GithubService
@Path("/")
class Site(val g:GithubService){
    @GET
    @Path("/")
    fun index(): IndexView {

        return IndexView(this.g.getSignInURL())
    }
}