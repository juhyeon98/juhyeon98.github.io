(function() {
  const allTags = JSON.parse(document.getElementById('tag-data').textContent);

  const input = document.getElementById('tag-search');
  const acList = document.getElementById('autocomplete-list');

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

  input.addEventListener('input', () => {
    const val = input.value.trim().replace(/^#/, '');
    filterPosts(val);
    showAutocomplete(val);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { acList.innerHTML = ''; }, 150);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) acList.innerHTML = '';
  });
})();