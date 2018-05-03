# vue-tableutils
给vue后台项目用的实用table指令

## sort参数
* 在table标签中添加`v-sort`指令,后可接参数表示默认排序。
  * 当v-sort后接参数（数组）时，建议在data中定义，直接在方法中将参数传到接口即可（directive已动态改变参数）。
  * 当v-sort后不接参数时，需要在方法中接收`directive`传出的数据，使用`e.detail`调用。
* 在th中使用`sort-field`属性 来标记你需要排序的列名。
* 最后使用`@sort`接方法名，在该方法中调用排序接口即可。

## drag参数
* 在table标签中添加`v-drag`，后可接参数来决定在距列右侧多少像素可以拖拉。默认10像素。
* 定义全局css样式`box-sizing: border-box`。
* 若使用`table-layout: fixed`，建议使用以下样式：
  ```
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
  ```
