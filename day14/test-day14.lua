local lu = require('luaunit')
local File = require('lib.file')
local Day14 = require('day14.day14')

TestDay14 = {}

function TestDay14:setUp()
    self.input_test = File:lines_from('day14/input-test.txt')
    self.input = File:lines_from('day14/input.txt')
end

function TestDay14:test_find_polymer_chain()
    lu.assertEquals(Day14.find_polymer_chain(self.input_test), 1588)
    lu.assertEquals(Day14.find_polymer_chain(self.input), 2937)
end
