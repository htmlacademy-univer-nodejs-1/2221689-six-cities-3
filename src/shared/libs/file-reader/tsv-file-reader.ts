import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Convenience, HousingType, RentalOffer, UserType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
        private readonly filename: string
  ) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }


    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, previewImage, images, premium, favorite,
        rating, type, roomsCount, guestsCount, price, conveniences, commentsCount, coordinats, name, email, avatarPath, password, userType]) => ({
        title,
        description,
        createdDate: new Date(postDate),
        city,
        previewImage,
        images: images.split(';'),
        premium: Boolean(premium),
        favorite: Boolean(favorite),
        rating: Number.parseInt(rating, 10),
        type: type as HousingType,
        roomsCount: Number.parseInt(roomsCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        price: Number.parseInt(price.replace(/\s/g, ''), 10),
        conveniences: conveniences.split(';')
          .map((convenience) => convenience as Convenience),
        authorOffer: { name, email, avatarPath, password, type: UserType[userType.replace('\r', '') as keyof typeof UserType] },
        commentsCount: Number.parseInt(commentsCount, 10),
        coordinats: [Number.parseFloat(coordinats.split(';')[0]), Number.parseFloat(coordinats.split(';')[1])]
      }));
  }
}
