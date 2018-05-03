Vue.directive('drag', {
  inserted (el, binding) {
    const dragCells = Array.from(el.tHead.rows[0].cells);
    const margin = binding.value || 10;
    const positionMark = {
      clientX: 0,             // 在单元格右侧点击时的clientX
      clientOldWidth: 0,      // 所点击的单元格的宽度
      mousedown: false,       // 判断鼠标是否处于mousedown
      target: null,           // 点击的元素
    }
    for (const [index, th] of dragCells.entries()) {
      if (index !== dragCells.length - 1) {
        th.addEventListener('mousedown', function(e) {
          if (e.offsetX > e.target.clientWidth - margin) {
            for (const value of dragCells) {
              if (value !== dragCells[index + 1]) {
                value.width = value.clientWidth; // 设置除下一节点外的节点宽度
              }
            }
            dragCells[index + 1].width = '';  // 移除下一节点宽度
            positionMark.clientX = e.clientX;
            positionMark.mousedown = true;
            positionMark.clientOldWidth = e.target.clientWidth;
            positionMark.target = th;
          }
        });
        th.addEventListener('mousemove', function(e) {
          if (e.offsetX > th.clientWidth - margin) {
            th.style.cursor = 'col-resize';
          } else {
            th.style.cursor = '';
          }
        });
      }
    }
    document.addEventListener('mouseup', function (e) {
      if (positionMark.mousedown) {
        const nextTh = positionMark.target.nextElementSibling;
        nextTh.width = nextTh.clientWidth; // 设置下一节点的节点宽度
        positionMark.mousedown = false;
      }
    });
    el.addEventListener('mousemove', function (e) {
      if (positionMark.mousedown) {
        const width = positionMark.clientOldWidth + (e.clientX - positionMark.clientX)
        positionMark.target.width = Math.max(1, width);
      }
    });
  }
});
