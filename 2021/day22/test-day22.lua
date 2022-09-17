local lu = require('luaunit')
local File = require('lib.file')
local Day22 = require('day22.day22')

TestDay22 = {}

function TestDay22:setUp()
    self.input_test = File:lines_from('day22/input-test.txt')
    self.input_test_2 = File:lines_from('day22/input-test-2.txt')
    self.input_test_3 = File:lines_from('day22/input-test-3.txt')
    self.input = File:lines_from('day22/input.txt')
end

function TestDay22:test_count_initialization_region_cubes()
    lu.assertEquals(Day22.count_reboot_cubes(self.input_test, true), 39)
    lu.assertEquals(Day22.count_reboot_cubes(self.input_test_2, true), 590784)
    lu.assertEquals(Day22.count_reboot_cubes(self.input, true), 610196)
end

function TestDay22:test_count_reboot_cubes()
    lu.assertEquals(Day22.count_reboot_cubes(self.input_test, false), 39)
    lu.assertEquals(Day22.count_reboot_cubes(self.input_test_3, false), 2758514936282235)
    lu.assertEquals(Day22.count_reboot_cubes(self.input, false), 1282401587270826)
end
