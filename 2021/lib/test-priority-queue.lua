local lu = require("luaunit")
local PriorityQueue = require("lib.priority-queue")

TestPriorityQueue = {}

function TestPriorityQueue:setUp()
    self.q = PriorityQueue()
end

function TestPriorityQueue:test_empty_size_put_pop()
    lu.assertTrue(self.q:empty())
    self.q:put("b", 5)
    lu.assertFalse(self.q:empty())
    lu.assertEquals(self.q:size(), 1)
    self.q:put("z", 0)
    lu.assertEquals(self.q:size(), 2)
    self.q:put("dhkda", -1)
    lu.assertEquals(self.q:pop(), "dhkda")
    lu.assertEquals(self.q:pop(), "z")
    lu.assertEquals(self.q:pop(), "b")
    lu.assertTrue(self.q:empty())
end
