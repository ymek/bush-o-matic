require 'sinatra'
require 'sinatra/jbuilder'
require 'net/http'
require 'json'

# Monkey-patch allows 1.year, 2.years, etc.
class Integer
  def year
    self * (60 * 60 * 24 * 365)
  end
  alias :years :year
end


def sha512_for_ip(ip)
  Digest::SHA512.hexdigest(ip.to_s)
end


# Sinatra config
set :root, File.dirname(__FILE__)
set :public_folder, Proc.new { File.join(root, 'public') }
set :views, Proc.new { File.join(root, 'views') }

class DemoApp < Sinatra::Application
  get '/helo' do #, provides: 'json' do
    response.set_cookie('ip_foo',
                        value: sha512_for_ip(request.ip),
                        expires: Time.now + 1.year)

    @message = %(C is for cookie. That's good enough for me.)
    jbuilder :api_response
  end

  get '/ehlo' do #, provides: 'json' do
    if (sha = request.cookies['ip_foo']) && sha.eql?(sha512_for_ip(request.ip))
      uri = URI('http://services.packetizer.com/motd/?f=json')
      @data = JSON.parse(Net::HTTP.get(uri))
    else
      @message = 'No cookie.  No message.'
    end

    jbuilder :api_response
  end

  get '/' do
    send_file File.join(settings.views, 'index.html')
  end
end
