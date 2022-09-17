local lu = require('luaunit')
local File = require('lib.file')
local Day14 = require('day14.day14')

TestDay14 = {}

function TestDay14:setUp()
    self.input_test = File:lines_from('day14/input-test.txt')
    self.input = File:lines_from('day14/input.txt')
end

function TestDay14:test_find_polymer_chain_10_steps()
    lu.assertEquals(Day14.find_polymer_chain(self.input_test, 10), 1588)
    lu.assertEquals(Day14.find_polymer_chain(self.input, 10), 2937)
end

function TestDay14:test_find_polymer_chain_40_steps()
    lu.assertEquals(Day14.find_polymer_chain(self.input_test, 40), 2188189693529)
    lu.assertEquals(Day14.find_polymer_chain(self.input, 40), 3390034818249)
end
