// ======= DATE PICKER MODULE ======= //
export function createDatePicker(containerId) {
  const container = document.getElementById(containerId);
  container.classList.add('container');

  const datetimeBoxes = document.createElement('div');
  datetimeBoxes.classList.add('datetime-boxes');

  const fields = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  const inputs = {};
  const popups = {};

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
                        field === 'minute' ? 'mm' :
                        field === 'second' ? 'ss':
    input.readOnly = true;
    input.classList.add('field-size'); // optional: add class for CSS targeting

    if (field === 'year') input.classList.add('year');

    const popup = document.createElement('div');
    popup.id = `${containerId}_${field}Popup`;
    popup.classList.add('popup');

    wrapper.appendChild(input);
    wrapper.appendChild(popup);
    datetimeBoxes.appendChild(wrapper);

    inputs[field] = input;
    popups[field] = popup;
  });

  container.appendChild(datetimeBoxes);

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

  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    const popup = popups[key];
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      Object.values(popups).forEach(p => p.style.display = 'none');
      popup.style.display = 'block';
    });
  });

  document.addEventListener('click', () => {
    Object.values(popups).forEach(p => p.style.display = 'none');
  });

  function getISOTimestamp() {
    const values = Object.keys(inputs).map(k => {
      const pad = (k === 'year') ? 4 : 2;
      return String(inputs[k].value || '00').padStart(pad, '0');
    });
    return `${values[0]}-${values[1]}-${values[2]}T${values[3]}:${values[4]}:${values[5]}`;
  }

  return { getISOTimestamp };
}
