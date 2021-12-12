local lu = require('luaunit')
local File = require('lib.file')
local Day11 = require('day11.day11')

TestDay11 = {}

function TestDay11:setUp()
    self.input_test = File:lines_from('day11/input-test.txt')
    self.input = File:lines_from('day11/input.txt')
end

function TestDay11:test_count_flashes()
    lu.assertEquals(Day11.count_flashes(self.input_test), 1656)
    lu.assertEquals(Day11.count_flashes(self.input), 1588)
end

function TestDay11:test_find_simultaneous_flash_step()
    lu.assertEquals(Day11.find_simultaneous_flash_step(self.input_test), 195)
    lu.assertEquals(Day11.find_simultaneous_flash_step(self.input), 517)
end
