import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { createRentalOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultRentalOfferService, RentalOfferModel, RentalOfferService } from '../../shared/modules/rental-offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { RentalOffer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';


export class ImportCommand implements Command {
  private userService: UserService;
  private rentalOfferService: RentalOfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.rentalOfferService = new DefaultRentalOfferService(this.logger, RentalOfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const rentalOffer = createRentalOffer(line);
    await this.saveRentalOffer(rentalOffer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveRentalOffer(rentalOffer: RentalOffer) {
    const user = await this.userService.findOrCreate({
      ...rentalOffer.authorOffer,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.rentalOfferService.create({
      title: rentalOffer.title,
      description: rentalOffer.description,
      createdDate: rentalOffer.createdDate,
      city: rentalOffer.city,
      previewImage: rentalOffer.previewImage,
      images: rentalOffer.images,
      premium: rentalOffer.premium,
      favorite: rentalOffer.favorite,
      rating: rentalOffer.rating,
      type: rentalOffer.type,
      roomsCount: rentalOffer.roomsCount,
      guestsCount: rentalOffer.guestsCount,
      price: rentalOffer.price,
      conveniences: rentalOffer.conveniences,
      authorOfferId: user.id,
      commentsCount: rentalOffer.commentsCount,
      coordinats: rentalOffer.coordinats
    });

  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
