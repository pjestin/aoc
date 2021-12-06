local lu = require('luaunit')
local File = require('lib.file')
local Day06 = require('day06.day06')

TestDay06 = {}

function TestDay06:setUp()
    self.input_test = File:lines_from('day06/input-test.txt')[1]
    self.input = File:lines_from('day06/input.txt')[1]
end

function TestDay06:test_count_lanternfish()
    lu.assertEquals(Day06.count_lanternfish(self.input_test), 5934)
    lu.assertEquals(Day06.count_lanternfish(self.input), 365862)
end

return TestDay06
