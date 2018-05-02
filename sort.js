Vue.directive('sort', {
  inserted (el, binding, vnode) {
    const sortCells = el.tHead.rows[0].cells;
    let sortActive = '';
    /**@type {boolean}*/
    let isRight = false;
    const mark = {
      nameMark: '',
      sortMark: '',
    };
    if (binding.value) {
      mark.nameMark = binding.value[0];
      mark.sortMark = binding.value[1];
    }
    for (const cell of sortCells) {
      if (cell.hasAttribute('sort-field')) {
        if (mark.nameMark === cell.getAttribute('sort-field')) {
          isRight = true;
        }
        cell.innerHTML = `<span>${cell.innerHTML} <i class='fa fa-sort'></i></span>`;
        const sortArrow = cell.querySelector('.fa-sort');
        sortArrow.style.cursor = 'pointer';
        sortArrow.setAttribute('aria-hidden', 'true');
        const spanDom = sortArrow.closest('span');
        spanDom.style.cursor = 'pointer';
        spanDom.addEventListener('click', function(e) {
          mark.nameMark = cell.getAttribute('sort-field');
          if (sortActive === '' || sortActive === cell.getAttribute('sort-field')) {    //点击本节点时
            sortActive = cell.getAttribute('sort-field');
            let changeClass = /fa-sort-(.*)/.exec(sortArrow.className);
            switch (changeClass ? changeClass[1] : 'default') {
              case 'asc':
                sortArrow.classList.remove('fa-sort-asc');
                sortArrow.classList.add('fa-sort');
                mark.sortMark = 'default';
                break;
              case 'desc':
                sortArrow.classList.remove('fa-sort-desc');
                sortArrow.classList.add('fa-sort-asc');
                mark.sortMark = 'asc';
                break;
              case 'default':
                sortArrow.classList.remove('fa-sort');
                sortArrow.classList.add('fa-sort-desc');
                mark.sortMark = 'desc';
                break;
            }
          } else {                                              //点击其他元素时
            for (const dom of Array.from(spanDom.closest('tr').children)) {
              if (dom.getAttribute('sort-field') === sortActive) {
                sortArrow.classList.remove('fa-sort');
                sortArrow.classList.add('fa-sort-desc');
                dom.childNodes[0].childNodes[1].classList.remove('fa-sort-desc');
                dom.childNodes[0].childNodes[1].classList.remove('fa-sort-asc');
                dom.childNodes[0].childNodes[1].classList.add('fa-sort');
                mark.sortMark = 'desc';
              }
            }
            sortActive = cell.getAttribute('sort-field');
          }
          vnode.elm.dispatchEvent(new CustomEvent('sort', {detail: mark}));
        })
      }
    }
    if (isRight) {
      vnode.elm.dispatchEvent(new CustomEvent('sort', {detail: mark}));
    } else {
      throw new Error("初始化排序失败，检查拼写或查看是否绑定'sort-field'");
    }
  }
})
