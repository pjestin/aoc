local lu = require("luaunit")
local StringUtils = require("lib.string-utils")

TestStringUtils = {}

function TestStringUtils:test_split()
    lu.assertEquals(StringUtils.split("hello world"), {"hello", "world"})
    lu.assertEquals(StringUtils.split("hello world", " "), {"hello", "world"})
    lu.assertEquals(StringUtils.split("one;two;;four", ";"), {"one", "two", "", "four"})
    lu.assertEquals(StringUtils.split("forward 2"), {"forward", "2"})
end

function TestStringUtils:test_to_table()
    lu.assertEquals(StringUtils.to_table("hello"), {"h", "e", "l", "l", "o"})
    lu.assertEquals(StringUtils.to_table("one;two;;four"),
        {"o", "n", "e", ";", "t", "w", "o", ";", ";", "f", "o", "u", "r"})
end
