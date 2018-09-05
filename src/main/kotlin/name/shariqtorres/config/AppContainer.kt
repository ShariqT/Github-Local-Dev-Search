package name.shariqtorres.config
import io.dropwizard.Application
import io.dropwizard.assets.AssetsBundle
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import io.dropwizard.views.ViewBundle
import name.shariqtorres.resources.Site
import name.shariqtorres.resources.AuthResources
import name.shariqtorres.services.GithubService

class AppContainer() : Application<AppConfig>(){
    override fun initialize(bootstrap: Bootstrap<AppConfig>) {
        super.initialize(bootstrap)
        bootstrap.addBundle(ViewBundle<AppConfig>())
        bootstrap.addBundle(AssetsBundle())

    }
    override fun run(configuration: AppConfig, environment: Environment) {
        val g = GithubService(configuration.client_id, configuration.client_secret)
        environment.jersey().register(AuthResources(g))
        environment.jersey().register(Site(g))
    }
}