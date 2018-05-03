Vue.directive('sort', {
  inserted (el, binding, vnode) {
    console.log(vnode)
    const sortCells = el.tHead.rows[0].cells;
    const mark = binding.value || ['', 'default'];
    for (const cell of sortCells) {
      if (cell.hasAttribute('sort-field')) {
        if (mark[0] !== 'default') {
          if (cell.getAttribute('sort-field') === mark[0]) {
            cell.innerHTML = `<a>${cell.innerHTML} <i class="fa fa-sort fa-sort-${mark[1]}"></i></a>`;
          } else {
            cell.innerHTML = `<a>${cell.innerHTML} <i class="fa fa-sort"></i></a>`;
          }
        } else {
          cell.innerHTML = `<a>${cell.innerHTML} <i class="fa fa-sort"></i></a>`;
        }
        const sortArrow = cell.querySelector('.fa-sort');
        sortArrow.style.cursor = 'pointer';
        sortArrow.setAttribute('aria-hidden', 'true');
        const spanDom = sortArrow.parentElement;
        spanDom.style.cursor = 'pointer';

        spanDom.addEventListener('click', function(e) {
          if (mark[0] === '' || mark[0] === cell.getAttribute('sort-field')) {    //点击本节点时
            mark[0] = cell.getAttribute('sort-field');
            switch (mark[1]) {
              case 'asc':
                sortArrow.classList.remove('fa-sort-asc');
                sortArrow.classList.add('fa-sort');
                mark[1] = 'default';
                break;
              case 'desc':
                sortArrow.classList.remove('fa-sort-desc');
                sortArrow.classList.add('fa-sort-asc');
                mark[1] = 'asc';
                break;
              case 'default':
                sortArrow.classList.remove('fa-sort');
                sortArrow.classList.add('fa-sort-desc');
                mark[1] = 'desc';
                break;
            }
          } else {                                                     // 点击其他元素时                                                                 // sortArrow为当前点击的元素。
            const sortDom = spanDom.closest('tr').querySelector(`:scope > th[sort-field="${mark[0]}"] .fa`);
            sortArrow.classList.remove('fa-sort');                 // sortArrow为当前点击的元素。
            sortArrow.classList.add('fa-sort-desc');
            sortDom.classList.remove('fa-sort-desc');
            sortDom.classList.remove('fa-sort-asc');
            sortDom.classList.add('fa-sort');
            mark[1] = 'desc';
            mark[0] = cell.getAttribute('sort-field');
          }
          el.dispatchEvent(new CustomEvent('sort', {detail: mark}));
        })
      }
    }
    if (mark[0] && !el.querySelector(`th[sort-field="${mark[0]}"]`)) {
      throw new Error("初始化排序失败，检查拼写或查看是否绑定'sort-field'");
    }
  }
})
