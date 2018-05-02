#vue-tableutils
给vue后台项目用的实用table指令

## sort参数
* 在table标签中添加`v-sort="['age', 'asc']"`指令，后面的数组参数第一项是你想要初始化排序的列，第二项是初始化排序的方式（升序或降序）。
* 在th中使用`sort-field`属性 来标记你需要排序的列名。
* 最后使用`@sort`来获取该`directive`传出的数据。包括列名和排序方式

## drag参数
* 在table标签中添加`v-drag`，后可接参数来决定在距列右侧多少像素可以拖拉。默认10像素。
