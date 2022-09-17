local lu = require("luaunit")
local Queue = require("lib.queue")

TestQueue = {}

function TestQueue:test_to_string()
    local queue = Queue:new()
    queue:push(1)
    queue:push("aei")
    queue:push("HAHA")
    lu.assertEquals(queue:to_string(), "1, aei, HAHA")
end

function TestQueue:test_pop()
    local queue = Queue:new()
    queue:push(1)
    queue:push("aei")
    lu.assertEquals(queue:pop(), 1)
    lu.assertEquals(queue:pop(), "aei")
    lu.assertEquals(queue:pop(), nil)
end

function TestQueue:test_is_empty()
    local queue = Queue:new()
    queue:push(1)
    queue:push("aei")
    lu.assertEquals(queue:is_empty(), false)
    lu.assertEquals(queue:pop(), 1)
    lu.assertEquals(queue:is_empty(), false)
    lu.assertEquals(queue:pop(), "aei")
    lu.assertEquals(queue:is_empty(), true)
end
