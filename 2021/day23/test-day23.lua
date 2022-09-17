local lu = require('luaunit')
local File = require('lib.file')
local Day23 = require('day23.day23')

TestDay23 = {}

function TestDay23:setUp()
    self.input_test = File:lines_from('day23/input-test.txt')
    self.input = File:lines_from('day23/input.txt')
    self.extra_lines = File:lines_from('day23/extra-lines.txt')
end

function TestDay23:test_find_least_energy_organisation()
    lu.assertEquals(Day23.find_least_energy_organisation(self.input_test), 12521)
    lu.assertEquals(Day23.find_least_energy_organisation(self.input), 15237)
end

function TestDay23:test_find_least_energy_organisation_with_extra_lines()
    lu.assertEquals(Day23.find_least_energy_organisation_with_extra_lines(self.input_test, self.extra_lines), 44169)
    lu.assertEquals(Day23.find_least_energy_organisation_with_extra_lines(self.input, self.extra_lines), 47509)
end
