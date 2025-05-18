/**
 * Вставляет SVG-иконку в указанный контейнер, с возможностью задать ширину, высоту и цвет.
 * Если цвет не указан, иконка сохраняет свои оригинальные цвета (даже если их несколько).
 * Если ширина или высота не указаны, используются оригинальные размеры SVG.
 *
 * @param {string} containerId - ID контейнера, в который будет вставлена иконка.
 * @param {string} folderPath - Путь к папке с иконками.
 * @param {string} iconName - Имя файла иконки (без расширения).
 * @param {string} [extension='svg'] - Расширение файла иконки.
 * @param {number|null} [width=null] - Ширина иконки. Если null, не изменяется.
 * @param {number|null} [height=null] - Высота иконки. Если null, не изменяется.
 * @param {string|null} [color=null] - Цвет заливки. Если null, сохраняются оригинальные цвета.
 */
function insertIcon(containerId, folderPath, iconName, extension = 'svg', width = null, height = null, color = null, hoverColor = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер с id "${containerId}" не найден`);
    return;
  }

  const filePath = `${folderPath}/${iconName}.${extension}`;

  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Не удалось загрузить иконку по пути: ${filePath}`);
      }
      return response.text();
    })
    .then(svgText => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgText;

      const svgElement = tempDiv.querySelector('svg');
      if (!svgElement) {
        throw new Error(`Файл ${filePath} не содержит корректный SVG`);
      }

      // Устанавливаем ширину и высоту, если они указаны
      if (width !== null) {
        svgElement.setAttribute('width', width);
      }
      if (height !== null) {
        svgElement.setAttribute('height', height);
      }

      // Изменяем цвет только если он указан
      if (color !== null) {
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
          path.setAttribute('fill', color);
        });
      }

      // Изменяем цвет при наведении, если он указан
      if (hoverColor !== null) {
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
          path.setAttribute('fill', color);
          path.addEventListener('mouseover', () => {
            path.setAttribute('fill', hoverColor);
          });
          path.addEventListener('mouseout', () => {
            path.setAttribute('fill', color);
          });
        });
      }

      container.appendChild(svgElement);
    })
    .catch(error => {
      console.error(`Ошибка: ${error.message}`);
    });
}