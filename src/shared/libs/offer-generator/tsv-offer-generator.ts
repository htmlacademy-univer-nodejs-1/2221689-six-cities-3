import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { Good, HousingType, MockServerData, UserType } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 1;
const MAX_PRICE = 10;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }
  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const [city, location] = getRandomItem<string>(this.mockData.cities).split(' ');
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItem<string>(this.mockData.images);
    const isPremium = getRandomItem<string>(['true', 'false']);
    const type = getRandomItem(Object.values(HousingType));
    const bedrooms = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const maxAdults = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const goods = getRandomItems<Good>(Object.values(Good)).join(';');
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatarUrl = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem(Object.values(UserType));

    return [
      title, description,
      city, previewImage, images,
      isPremium, type, bedrooms, maxAdults,
      price, goods, name, email,
      avatarUrl, password, userType, location
    ].join('\t');
  }
}
