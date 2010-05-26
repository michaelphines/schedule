MongoMapper.connection = Mongo::Connection.new(ENV["SCHEDULE_MONGO_HOST"], ENV["SCHEDULE_MONGO_PORT"], { :logger => Rails.logger })
MongoMapper.database = "#{ENV["SCHEDULE_MONGO_DATABASE"]}-#{Rails.env}"
MongoMapper.database.authenticate(ENV["SCHEDULE_MONGO_USER"], ENV["SCHEDULE_MONGO_PASSWORD"])
