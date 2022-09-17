local lu = require('luaunit')
local File = require('lib.file')
local Day06 = require('day06.day06')

TestDay06 = {}

function TestDay06:setUp()
    self.input_test = File:lines_from('day06/input-test.txt')[1]
    self.input = File:lines_from('day06/input.txt')[1]
end

function TestDay06:test_count_lanternfish()
    lu.assertEquals(Day06.count_lanternfish(self.input_test, 80), 5934)
    lu.assertEquals(Day06.count_lanternfish(self.input, 80), 365862)
    lu.assertEquals(Day06.count_lanternfish(self.input_test, 256), 26984457539)
    lu.assertEquals(Day06.count_lanternfish(self.input, 256), 1653250886439)
end
