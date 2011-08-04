# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)

require 'resque/server'
run Rack::URLMap.new \
  "/"       => Gorilla::Application,
  "/resque2140" => Resque::Server.new