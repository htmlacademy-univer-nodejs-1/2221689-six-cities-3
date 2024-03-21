import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { Convenience, HousingType, MockServerData, UserType } from '../../types/index.js';
import { RentalOfferGenerator } from './rental-offer-generator.interface.js';

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 1;
const MAX_PRICE = 10;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 500;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVRentalOfferGenerator implements RentalOfferGenerator {
  constructor(private readonly mockData: MockServerData) { }
  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities).split(' ')[0];
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItem<string>(this.mockData.images);
    const premium = getRandomItem<string>(['true', 'false']);
    const favorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const type = getRandomItem(Object.values(HousingType));
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const conveniences = getRandomItems<Convenience>(Object.values(Convenience)).join(';');
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatarPath = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem(Object.values(UserType));
    const commentsCount = generateRandomValue(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).toString();
    const coordinats = getRandomItem<string>(this.mockData.cities).split(' ')[1];

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title, description, createdDate,
      city, previewImage, images,
      premium, favorite, rating,
      type, roomsCount, guestsCount,
      price, conveniences, name, email,
      avatarPath, password, userType, commentsCount, coordinats
    ].join('\t');
  }
}
