local lu = require('luaunit')

require('test.test_day01')

os.exit( lu.LuaUnit.new():runSuite() )
