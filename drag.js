Vue.directive('drag', {
  inserted (el, binding) {
    const dragCells = Array.from(el.tHead.rows[0].cells);
    const margin = binding.value || 10;
    let changeCellWidth;
    const positionMark = {
      clientX: '',            // 在单元格右侧点击时的clientX
      clientOldWidth: '',     // 所点击的单元格的宽度
      clientWidth: '',        // 拖动时的单元格的宽度
      mousedown: false,       // 判断鼠标是否处于mousedown
      target: '',             // 点击的元素
      positionTh: 0,          // 存储下一节点的位置
    }
    for (const [index, th] of dragCells.entries()) {
      if (th !== dragCells[dragCells.length - 1]) {
        th.addEventListener('mousedown', function(e) {
          if (e.offsetX > e.target.clientWidth - margin) {
            for (const value of dragCells) {
              if (value !== dragCells[index + 1]) {
                value.width = value.offsetWidth; // 设置除下一节点外的节点宽度
              }
            }
            dragCells[index + 1].width = '';  // 移除下一节点宽度
            positionMark.clientX = e.clientX;
            positionMark.mousedown = true;
            positionMark.clientOldWidth = e.target.clientWidth;
            positionMark.target = th;
            positionMark.positionTh = index + 1;
          }
        });
      }
      th.addEventListener('mousemove', function(e) {
        if (e.offsetX > th.clientWidth - margin && th !== dragCells[dragCells.length - 1]) {
          th.style.cursor = 'col-resize';
        } else {
          th.style.cursor = '';
        }
      });
    }
    document.addEventListener('mouseup', function (e) {
      if (positionMark.mousedown) {
        dragCells[positionMark.positionTh].width = dragCells[positionMark.positionTh].clientWidth; // 设置下一节点的节点宽度
      }
      positionMark.mousedown = false;
    });
    el.addEventListener('mousemove', function (e) {
      if (positionMark.mousedown === true) {
        if (positionMark.clientOldWidth + (e.clientX - positionMark.clientX) > 0) {
          if (e.target === positionMark.target) {    //在本元素上拉长宽度
            e.target.style.cursor = 'col-resize';
            positionMark.clientWidth = positionMark.clientOldWidth + (e.clientX - positionMark.clientX);
            e.target.width = positionMark.clientWidth;
          } else {
            e.target.style.cursor = '';
            positionMark.clientWidth = positionMark.clientOldWidth + (e.clientX - positionMark.clientX);
            positionMark.target.width = positionMark.clientWidth;
          }
        }
      }
    });
  }
});
