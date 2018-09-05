package name.shariqtorres.resources
import io.dropwizard.views.View

class IndexView (var signInURL:String?):View("index.ftl"){

    init {
        if(this.signInURL == null){
            this.signInURL = "";
        }
    }
}
