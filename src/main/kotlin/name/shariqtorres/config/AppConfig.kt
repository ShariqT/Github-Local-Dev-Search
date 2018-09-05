package name.shariqtorres.config

import io.dropwizard.Configuration

class AppConfig (val name:String = "app2", val client_id:String = "", val client_secret:String = "") : Configuration()
