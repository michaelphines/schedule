require 'rubygems'
require 'jazz_money'

javascript_files = [
  'public/javascripts/jquery-1.4.2.js',
  'public/javascripts/jquery-ui-1.8.2.custom.min.js',
  'public/javascripts/jquery.calendarSelect.js',
  'spec/javascripts/helpers/SpecHelper.js'
]

jasmine_spec_files = [
  'spec/javascripts/calendarSelectSpec.js'
]

JazzMoney::Runner.new(javascript_files, jasmine_spec_files).call
