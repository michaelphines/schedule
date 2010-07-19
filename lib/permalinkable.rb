module Permalinkable
  
  def self.included(base)
    base.extend(Permalinkable::ClassMethods)
    base.class_eval do 
      include Permalinkable::InstanceMethods
      field :permalink, :type => String

      before_create :create_permalink
    end
  end
  
  module ClassMethods
    def from_param(permalink)
      self.where(:permalink => permalink).first
    end
  end
  
  module InstanceMethods
    def to_param
      permalink
    end

    def create_permalink
      self.permalink = "#{random_word}-#{random_word}"
    end

    def random_word(max = 10000)
      Rufus::Mnemo.from_i(ActiveSupport::SecureRandom.random_number(max))    
    end  
  end

end