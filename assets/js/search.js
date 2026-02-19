(function() {
  const allTags = JSON.parse(document.getElementById('tag-data').textContent);

  const input = document.getElementById('tag-search');
  const acList = document.getElementById('autocomplete-list');
  let selectedIndex = -1;

  function getPostItems() {
    return document.querySelectorAll('.post-item');
  }

  function filterPosts(val) {
    getPostItems().forEach(item => {
      const tags = item.dataset.tags ? item.dataset.tags.split(',') : [];
      if (!val || tags.some(t => t.toLowerCase().includes(val.toLowerCase()))) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  function showAutocomplete(val) {
    acList.innerHTML = '';
    selectedIndex = -1;
    if (!val) return;
    const matches = allTags.filter(t => t.toLowerCase().includes(val.toLowerCase()));
    matches.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        input.value = tag;
        acList.innerHTML = '';
        filterPosts(tag);
      });
      acList.appendChild(li);
    });
  }

  function updateSelection(items) {
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });
  }

  input.addEventListener('input', () => {
    const val = input.value.trim().replace(/^#/, '');
    filterPosts(val);
    showAutocomplete(val);
  });

  input.addEventListener('keydown', (e) => {
    const items = Array.from(acList.querySelectorAll('li'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        input.value = items[selectedIndex].textContent;
        filterPosts(input.value);
      } else {
        filterPosts(input.value.trim().replace(/^#/, ''));
      }
      acList.innerHTML = '';
      selectedIndex = -1;
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { acList.innerHTML = ''; selectedIndex = -1; }, 150);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      acList.innerHTML = '';
      selectedIndex = -1;
    }
  });
})();