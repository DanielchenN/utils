# 初衷
写这个的初衷是在 解析Yapi返回的json schema的时候，yapi返回的数据不是一个json.stringify过的object。而是 {code:1, children : {msg: 2}} 这样的一个string。

# Reason

When i tried to parse the Json shcema data which from Yapi, i encounted a problem that the returning data is not stringify through JSON.stringify but something like  {code:1, children : {msg: 2}}. 