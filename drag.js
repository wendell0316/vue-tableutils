Vue.directive('drag', {
  inserted (el, binding) {
    el.style.boxSizing = 'border-box';
    const dragCells = Array.from(el.tHead.rows[0].cells);
    let margin = 10;
    if (binding.value) {
      margin = binding.value;
    }
    let changeCellWidth;
    const positionMark = {
      clientX: '',
      clientOldWidth: '',
      clientWidth: '',
      mousedown: false,
      target: '',
      positionTh: 0,
    }
    for (const [index,th] of dragCells.entries()) {
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
