filter = "orderby=price-desc&"

newURL = "https://davidsw.com/?filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"

result = newURL.substring(0,newURL.indexOf("&")+1)+filter+newURL.substring(newURL.indexOf("&s")+1)
console.log(result)

//https://davidsw.com/?filter_dial-color=black&orderby=price&paged=1&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1
//https://davidsw.com/?                        orderby=price&paged=1&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1
//https://davidsw.com/?filter_dial-color=white&orderby=price&paged=1&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1