// ======= DATE PICKER MODULE ======= //
export function createDatePicker(containerId) {
  const container = document.getElementById(containerId);
  container.classList.add('container');

  const datetimeBoxes = document.createElement('div');
  datetimeBoxes.classList.add('datetime-boxes');

  const fields = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  const inputs = {};
  const popups = {};

  // Create input fields and popups
  fields.forEach(field => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('box-wrapper');

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${containerId}_${field}`;
    input.placeholder = field === 'year' ? 'YYYY' :
      field === 'month' ? 'MM' :
        field === 'day' ? 'DD' :
          field === 'hour' ? 'hh' :
            field === 'minute' ? 'mm' : 'ss';
    input.readOnly = true;

    // Apply your existing CSS classes
    input.classList.add('field-size'); // default for all
    if (field === 'year') input.classList.add('year'); // year overrides width

    const popup = document.createElement('div');
    popup.id = `${containerId}_${field}Popup`;
    popup.className = 'popup';

    wrapper.appendChild(input);
    wrapper.appendChild(popup);
    datetimeBoxes.appendChild(wrapper);

    inputs[field] = input;
    popups[field] = popup;
  });

  container.appendChild(datetimeBoxes);

  // Populate popup with numbers
  function populatePopup(popup, start, end, pad = 2) {
    popup.innerHTML = '';
    for (let i = start; i <= end; i++) {
      const div = document.createElement('div');
      div.textContent = String(i).padStart(pad, '0');
      div.addEventListener('click', () => {
        popup.previousElementSibling.value = div.textContent;
        popup.style.display = 'none';
      });
      popup.appendChild(div);
    }
  }

  const currentYear = new Date().getFullYear();
  populatePopup(popups.year, 2020, currentYear, 4);
  populatePopup(popups.month, 1, 12);
  populatePopup(popups.day, 1, 31);
  populatePopup(popups.hour, 0, 23);
  populatePopup(popups.minute, 0, 59);
  populatePopup(popups.second, 0, 59);

  // Popup toggle logic
  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    const popup = popups[key];

    input.addEventListener('click', e => {
      e.stopPropagation();

      // Close all other popups
      Object.keys(popups).forEach(k => {
        if (k !== key) popups[k].style.display = 'none';
      });

      // Toggle current popup
      popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    });

    // Clicking inside popup does not close it
    popup.addEventListener('click', e => e.stopPropagation());
  });

  // Clicking outside closes all popups
  document.addEventListener('click', () => {
    Object.values(popups).forEach(p => p.style.display = 'none');
  });

  // Return ISO timestamp
  function getISOTimestamp() {
    const values = fields.map(f => {
      const pad = (f === 'year') ? 4 : 2;
      return String(inputs[f].value || '00').padStart(pad, '0');
    });
    return `${values[0]}-${values[1]}-${values[2]}T${values[3]}:${values[4]}:${values[5]}`;
  }

  return { getISOTimestamp };
}
