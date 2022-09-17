local Queue = {}

function Queue:new(o)
    o = o or {
        data = {},
        queue_start = 1,
        queue_end = 0
    }
    setmetatable(o, self)
    self.__index = self
    return o
end

function Queue:to_string()
    local elements = {}
    for _, v in pairs(self.data) do
        table.insert(elements, v)
    end
    return table.concat(elements, ", ")
end

function Queue:push(o)
    self.queue_end = self.queue_end + 1
    self.data[self.queue_end] = o
end

function Queue:pop()
    if self.queue_end >= self.queue_start then
        local element = self.data[self.queue_start]
        self.data[self.queue_start] = nil
        self.queue_start = self.queue_start + 1
        return element
    else
        return nil
    end
end

function Queue:is_empty()
    return self.queue_end < self.queue_start
end

return Queue
