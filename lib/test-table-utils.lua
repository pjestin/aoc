local lu = require("luaunit")
local TableUtils = require("lib.table-utils")

TestTableUtils = {}

function TestTableUtils:test_copy(t)
    local a = {
        "abc",
        ert = 2,
        true
    }
    local b = TableUtils.copy(a)
    lu.assertEquals(b[1], "abc")
    lu.assertEquals(b.ert, 2)
    lu.assertEquals(b[2], true)
end

function TestTableUtils:test_copy_modify(t)
    local a = {
        "abc",
        ert = 2,
        true
    }
    local b = TableUtils.copy(a)
    a[1] = "efg"
    lu.assertEquals(b[1], "abc")
end

function TestTableUtils:test_to_string(t)
    local a = {
        "abc",
        ert = 2
    }
    lu.assertEquals(TableUtils.to_string(a), "{1 = abc, ert = 2, }")
end

function TestTableUtils:test_max(t)
    local a = {
        abc = 56,
        [1] = -87,
        [76] = 654
    }
    lu.assertEquals(TableUtils.max(a), 654)
end
