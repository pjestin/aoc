local lu = require("luaunit")
local Stack = require("lib.stack")

TestStack = {}

function TestStack:test_to_string()
    local stack = Stack:new()
    stack:push(1)
    stack:push("aei")
    stack:push("HAHA")
    lu.assertEquals(stack:to_string(), "1, aei, HAHA")
end

function TestStack:test_pop()
    local stack = Stack:new()
    stack:push(1)
    stack:push("aei")
    lu.assertEquals(stack:pop(), "aei")
    lu.assertEquals(stack:pop(), 1)
    lu.assertEquals(stack:pop(), nil)
end

function TestStack:test_is_empty()
    local stack = Stack:new()
    stack:push(1)
    stack:push("aei")
    lu.assertEquals(stack:is_empty(), false)
    lu.assertEquals(stack:pop(), "aei")
    lu.assertEquals(stack:is_empty(), false)
    lu.assertEquals(stack:pop(), 1)
    lu.assertEquals(stack:is_empty(), true)
end
