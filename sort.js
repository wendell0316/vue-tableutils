Vue.directive('sort', {
  inserted (el, binding, vnode) {
    const sortCells = el.tHead.rows[0].cells;
    /**@type {boolean}*/
    const mark = {
      nameMark: '',
      sortMark: 'default',
    };
    if (binding.value) {
      mark.nameMark = binding.value[0];
      mark.sortMark = binding.value[1];
    }
    for (const cell of sortCells) {
      if (cell.hasAttribute('sort-field')) {
        if (mark.sortMark !== 'default') {
          if (cell.getAttribute('sort-field') === mark.nameMark) {
            cell.innerHTML = `<span>${cell.innerHTML} <i class="fa fa-sort fa-sort-${mark.sortMark}"></i></span>`;
            vnode.elm.dispatchEvent(new CustomEvent('sort', {detail: mark}));
          } else {
            cell.innerHTML = `<span>${cell.innerHTML} <i class="fa fa-sort"></i></span>`;
          }
        } else {
          cell.innerHTML = `<span>${cell.innerHTML} <i class="fa fa-sort"></i></span>`;
        }
        const sortArrow = cell.querySelector('.fa-sort');
        sortArrow.style.cursor = 'pointer';
        sortArrow.setAttribute('aria-hidden', 'true');
        const spanDom = sortArrow.closest('span');
        spanDom.style.cursor = 'pointer';

        spanDom.addEventListener('click', function(e) {
          if (mark.nameMark === '' || mark.nameMark === cell.getAttribute('sort-field')) {    //点击本节点时
            mark.nameMark = cell.getAttribute('sort-field');
            switch (mark.sortMark) {
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
          } else {                                                     // 点击其他元素时                                                                 // sortArrow为当前点击的元素。
            const sortDom = spanDom.closest('tr').querySelector(`:scope > th[sort-field="${mark.nameMark}"] .fa`);
            sortArrow.classList.remove('fa-sort');                 // sortArrow为当前点击的元素。
            sortArrow.classList.add('fa-sort-desc');
            sortDom.classList.remove('fa-sort-desc');
            sortDom.classList.remove('fa-sort-asc');
            sortDom.classList.add('fa-sort');
            mark.sortMark = 'desc';
            mark.nameMark = cell.getAttribute('sort-field');
          }
          vnode.elm.dispatchEvent(new CustomEvent('sort', {detail: mark}));
        })
      }
    }
    if (mark.nameMark && !el.querySelector(`th[sort-field="${mark.nameMark}"]`)) {
      throw new Error("初始化排序失败，检查拼写或查看是否绑定'sort-field'");
    }
  }
})
