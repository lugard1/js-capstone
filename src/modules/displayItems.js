import { listItemsContainer } from './domSelector.js';
import fetchSingleShow from './popupReservation.js';

const render = (data) => {
  if (data.length > 0) {
    listItemsContainer.innerHTML = '';

    data.forEach((i) => {
      const item = document.createElement('li');
      item.id = i.id;
      item.className = 'show-item';

      // create sho Img element
      const showImg = document.createElement('div');
      showImg.className = 'show-item-img';
      showImg.innerHTML = `<img src='${i.image.original}'>`;

      // create show info
      const showInfo = document.createElement('div');
      showInfo.className = 'show-info';

      // create tile for show info
      const title = document.createElement('h3');
      title.className = 'show-title';
      title.innerText = i.name;

      // like action
      const showLikeAction = document.createElement('div');
      showLikeAction.className = 'shwo-like-action';

      // like button
      const btnLike = document.createElement('button');
      btnLike.className = 'btn-like';
      btnLike.innerHTML = "<img src='./assets/img/icons8-favorite-30.png' alt='favorite'>";

      // like count
      const likeCount = document.createElement('span');
      if (i.likes > 1) {
        likeCount.innerText = `${i.likes} likes`;
      } else {
        likeCount.innerHTML = `${i.likes} like`;
      }

      showLikeAction.append(btnLike, likeCount); // append like actions child element.

      showInfo.append(title, showLikeAction); // append in showInfo

      // show action
      const showActions = document.createElement('div');
      showActions.className = 'show-actions';

      // create child btn
      const commentBtn = document.createElement('button');
      commentBtn.className = 'btn-action btn-comment';
      commentBtn.innerText = 'Comments';
      commentBtn.addEventListener('click', (e) => {
        fetchSingleShow(e);
      });

      const reservationBtn = document.createElement('button');
      reservationBtn.className = 'btn-action btn-reservation';
      reservationBtn.innerText = 'Reservations';
      reservationBtn.addEventListener('click', (e) => {
        fetchSingleShow(e);
      });

      showActions.append(commentBtn, reservationBtn); // append child action buttons in showActions

      item.append(showImg, showInfo, showActions); // append clild all the elements in item.

      listItemsContainer.appendChild(item);
    });
  } else {
    listItemsContainer.innerHTML = '<p class="no-data">No Data Found</p>';
  }
};

const fetchTvShows = async (movieApi, invApi) => {
  const res = await fetch(movieApi);
  const result = await res.json();

  // call the Involment api to get likes
  const resInv = await fetch(`${invApi}/likes/`);
  const likesResult = await resInv.json();

  // filter Array thats have Likes
  const filterArrWithLikes = [];
  result.forEach((item) => {
    likesResult.forEach((likeItem) => {
      if (item.id === likeItem.item_id) {
        filterArrWithLikes.push({ ...item, likes: likeItem.likes });
      }
    });
  });

  // filter Array thats have not likes
  let filterWithoutLikes = [];
  filterWithoutLikes = result.filter(
    (el) => !filterArrWithLikes.find((element) => element.id === el.id),
  ); //eslint-disable-line

  // modify the filterWithout array likes count 0;
  const modifiyFilterWithoutLikes = [];
  filterWithoutLikes.forEach((item) => {
    modifiyFilterWithoutLikes.push({ ...item, likes: 0 });
  });

  // join and sort the arrays
  const joinArr = modifiyFilterWithoutLikes.concat(filterArrWithLikes);
  joinArr.sort((a, b) => a.id - b.id);

  // call render function to display the item list
  render(joinArr);
};

export default fetchTvShows;
