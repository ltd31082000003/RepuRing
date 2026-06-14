import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace types. */
export namespace types {

    /** Properties of an Account. */
    interface IAccount {

        /** Account address */
        address?: (Uint8Array|null);

        /** Account amount */
        amount?: (number|Long|null);
    }

    /** Represents an Account. */
    class Account implements IAccount {

        /**
         * Constructs a new Account.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IAccount);

        /** Account address. */
        public address: Uint8Array;

        /** Account amount. */
        public amount: (number|Long);

        /**
         * Creates a new Account instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Account instance
         */
        public static create(properties?: types.IAccount): types.Account;

        /**
         * Encodes the specified Account message. Does not implicitly {@link types.Account.verify|verify} messages.
         * @param message Account message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Account message, length delimited. Does not implicitly {@link types.Account.verify|verify} messages.
         * @param message Account message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Account message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Account;

        /**
         * Decodes an Account message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Account;

        /**
         * Verifies an Account message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Account message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Account
         */
        public static fromObject(object: { [k: string]: any }): types.Account;

        /**
         * Creates a plain object from an Account message. Also converts values to other types if specified.
         * @param message Account
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Account, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Account to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Account
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Pool. */
    interface IPool {

        /** Pool id */
        id?: (number|Long|null);

        /** Pool amount */
        amount?: (number|Long|null);
    }

    /** Represents a Pool. */
    class Pool implements IPool {

        /**
         * Constructs a new Pool.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPool);

        /** Pool id. */
        public id: (number|Long);

        /** Pool amount. */
        public amount: (number|Long);

        /**
         * Creates a new Pool instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Pool instance
         */
        public static create(properties?: types.IPool): types.Pool;

        /**
         * Encodes the specified Pool message. Does not implicitly {@link types.Pool.verify|verify} messages.
         * @param message Pool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Pool message, length delimited. Does not implicitly {@link types.Pool.verify|verify} messages.
         * @param message Pool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Pool message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Pool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Pool;

        /**
         * Decodes a Pool message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Pool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Pool;

        /**
         * Verifies a Pool message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Pool message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Pool
         */
        public static fromObject(object: { [k: string]: any }): types.Pool;

        /**
         * Creates a plain object from a Pool message. Also converts values to other types if specified.
         * @param message Pool
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Pool, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Pool to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Pool
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Event. */
    interface IEvent {

        /** Event eventType */
        eventType?: (string|null);

        /** Event custom */
        custom?: (types.IEventCustom|null);

        /** Event height */
        height?: (number|Long|null);

        /** Event reference */
        reference?: (string|null);

        /** Event chainId */
        chainId?: (number|Long|null);

        /** Event blockHeight */
        blockHeight?: (number|Long|null);

        /** Event blockHash */
        blockHash?: (Uint8Array|null);

        /** Event address */
        address?: (Uint8Array|null);
    }

    /** Represents an Event. */
    class Event implements IEvent {

        /**
         * Constructs a new Event.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IEvent);

        /** Event eventType. */
        public eventType: string;

        /** Event custom. */
        public custom?: (types.IEventCustom|null);

        /** Event height. */
        public height: (number|Long);

        /** Event reference. */
        public reference: string;

        /** Event chainId. */
        public chainId: (number|Long);

        /** Event blockHeight. */
        public blockHeight: (number|Long);

        /** Event blockHash. */
        public blockHash: Uint8Array;

        /** Event address. */
        public address: Uint8Array;

        /** Event msg. */
        public msg?: "custom";

        /**
         * Creates a new Event instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Event instance
         */
        public static create(properties?: types.IEvent): types.Event;

        /**
         * Encodes the specified Event message. Does not implicitly {@link types.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Event message, length delimited. Does not implicitly {@link types.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Event message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Event;

        /**
         * Decodes an Event message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Event;

        /**
         * Verifies an Event message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Event message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Event
         */
        public static fromObject(object: { [k: string]: any }): types.Event;

        /**
         * Creates a plain object from an Event message. Also converts values to other types if specified.
         * @param message Event
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Event to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Event
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventCustom. */
    interface IEventCustom {

        /** EventCustom msg */
        msg?: (google.protobuf.IAny|null);
    }

    /** Represents an EventCustom. */
    class EventCustom implements IEventCustom {

        /**
         * Constructs a new EventCustom.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IEventCustom);

        /** EventCustom msg. */
        public msg?: (google.protobuf.IAny|null);

        /**
         * Creates a new EventCustom instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventCustom instance
         */
        public static create(properties?: types.IEventCustom): types.EventCustom;

        /**
         * Encodes the specified EventCustom message. Does not implicitly {@link types.EventCustom.verify|verify} messages.
         * @param message EventCustom message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IEventCustom, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventCustom message, length delimited. Does not implicitly {@link types.EventCustom.verify|verify} messages.
         * @param message EventCustom message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IEventCustom, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventCustom message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventCustom
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.EventCustom;

        /**
         * Decodes an EventCustom message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventCustom
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.EventCustom;

        /**
         * Verifies an EventCustom message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventCustom message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventCustom
         */
        public static fromObject(object: { [k: string]: any }): types.EventCustom;

        /**
         * Creates a plain object from an EventCustom message. Also converts values to other types if specified.
         * @param message EventCustom
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.EventCustom, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventCustom to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EventCustom
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FSMToPlugin. */
    interface IFSMToPlugin {

        /** FSMToPlugin id */
        id?: (number|Long|null);

        /** FSMToPlugin config */
        config?: (types.IPluginFSMConfig|null);

        /** FSMToPlugin genesis */
        genesis?: (types.IPluginGenesisRequest|null);

        /** FSMToPlugin begin */
        begin?: (types.IPluginBeginRequest|null);

        /** FSMToPlugin check */
        check?: (types.IPluginCheckRequest|null);

        /** FSMToPlugin deliver */
        deliver?: (types.IPluginDeliverRequest|null);

        /** FSMToPlugin end */
        end?: (types.IPluginEndRequest|null);

        /** FSMToPlugin stateRead */
        stateRead?: (types.IPluginStateReadResponse|null);

        /** FSMToPlugin stateWrite */
        stateWrite?: (types.IPluginStateWriteResponse|null);

        /** FSMToPlugin error */
        error?: (types.IPluginError|null);
    }

    /** Represents a FSMToPlugin. */
    class FSMToPlugin implements IFSMToPlugin {

        /**
         * Constructs a new FSMToPlugin.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IFSMToPlugin);

        /** FSMToPlugin id. */
        public id: (number|Long);

        /** FSMToPlugin config. */
        public config?: (types.IPluginFSMConfig|null);

        /** FSMToPlugin genesis. */
        public genesis?: (types.IPluginGenesisRequest|null);

        /** FSMToPlugin begin. */
        public begin?: (types.IPluginBeginRequest|null);

        /** FSMToPlugin check. */
        public check?: (types.IPluginCheckRequest|null);

        /** FSMToPlugin deliver. */
        public deliver?: (types.IPluginDeliverRequest|null);

        /** FSMToPlugin end. */
        public end?: (types.IPluginEndRequest|null);

        /** FSMToPlugin stateRead. */
        public stateRead?: (types.IPluginStateReadResponse|null);

        /** FSMToPlugin stateWrite. */
        public stateWrite?: (types.IPluginStateWriteResponse|null);

        /** FSMToPlugin error. */
        public error?: (types.IPluginError|null);

        /** FSMToPlugin payload. */
        public payload?: ("config"|"genesis"|"begin"|"check"|"deliver"|"end"|"stateRead"|"stateWrite"|"error");

        /**
         * Creates a new FSMToPlugin instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FSMToPlugin instance
         */
        public static create(properties?: types.IFSMToPlugin): types.FSMToPlugin;

        /**
         * Encodes the specified FSMToPlugin message. Does not implicitly {@link types.FSMToPlugin.verify|verify} messages.
         * @param message FSMToPlugin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IFSMToPlugin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FSMToPlugin message, length delimited. Does not implicitly {@link types.FSMToPlugin.verify|verify} messages.
         * @param message FSMToPlugin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IFSMToPlugin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FSMToPlugin message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FSMToPlugin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.FSMToPlugin;

        /**
         * Decodes a FSMToPlugin message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FSMToPlugin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.FSMToPlugin;

        /**
         * Verifies a FSMToPlugin message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FSMToPlugin message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FSMToPlugin
         */
        public static fromObject(object: { [k: string]: any }): types.FSMToPlugin;

        /**
         * Creates a plain object from a FSMToPlugin message. Also converts values to other types if specified.
         * @param message FSMToPlugin
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.FSMToPlugin, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FSMToPlugin to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FSMToPlugin
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginToFSM. */
    interface IPluginToFSM {

        /** PluginToFSM id */
        id?: (number|Long|null);

        /** PluginToFSM config */
        config?: (types.IPluginConfig|null);

        /** PluginToFSM genesis */
        genesis?: (types.IPluginGenesisResponse|null);

        /** PluginToFSM begin */
        begin?: (types.IPluginBeginResponse|null);

        /** PluginToFSM check */
        check?: (types.IPluginCheckResponse|null);

        /** PluginToFSM deliver */
        deliver?: (types.IPluginDeliverResponse|null);

        /** PluginToFSM end */
        end?: (types.IPluginEndResponse|null);

        /** PluginToFSM stateRead */
        stateRead?: (types.IPluginStateReadRequest|null);

        /** PluginToFSM stateWrite */
        stateWrite?: (types.IPluginStateWriteRequest|null);
    }

    /** Represents a PluginToFSM. */
    class PluginToFSM implements IPluginToFSM {

        /**
         * Constructs a new PluginToFSM.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginToFSM);

        /** PluginToFSM id. */
        public id: (number|Long);

        /** PluginToFSM config. */
        public config?: (types.IPluginConfig|null);

        /** PluginToFSM genesis. */
        public genesis?: (types.IPluginGenesisResponse|null);

        /** PluginToFSM begin. */
        public begin?: (types.IPluginBeginResponse|null);

        /** PluginToFSM check. */
        public check?: (types.IPluginCheckResponse|null);

        /** PluginToFSM deliver. */
        public deliver?: (types.IPluginDeliverResponse|null);

        /** PluginToFSM end. */
        public end?: (types.IPluginEndResponse|null);

        /** PluginToFSM stateRead. */
        public stateRead?: (types.IPluginStateReadRequest|null);

        /** PluginToFSM stateWrite. */
        public stateWrite?: (types.IPluginStateWriteRequest|null);

        /** PluginToFSM payload. */
        public payload?: ("config"|"genesis"|"begin"|"check"|"deliver"|"end"|"stateRead"|"stateWrite");

        /**
         * Creates a new PluginToFSM instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginToFSM instance
         */
        public static create(properties?: types.IPluginToFSM): types.PluginToFSM;

        /**
         * Encodes the specified PluginToFSM message. Does not implicitly {@link types.PluginToFSM.verify|verify} messages.
         * @param message PluginToFSM message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginToFSM, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginToFSM message, length delimited. Does not implicitly {@link types.PluginToFSM.verify|verify} messages.
         * @param message PluginToFSM message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginToFSM, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginToFSM message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginToFSM
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginToFSM;

        /**
         * Decodes a PluginToFSM message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginToFSM
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginToFSM;

        /**
         * Verifies a PluginToFSM message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginToFSM message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginToFSM
         */
        public static fromObject(object: { [k: string]: any }): types.PluginToFSM;

        /**
         * Creates a plain object from a PluginToFSM message. Also converts values to other types if specified.
         * @param message PluginToFSM
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginToFSM, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginToFSM to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginToFSM
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginConfig. */
    interface IPluginConfig {

        /** PluginConfig name */
        name?: (string|null);

        /** PluginConfig id */
        id?: (number|Long|null);

        /** PluginConfig version */
        version?: (number|Long|null);

        /** PluginConfig supportedTransactions */
        supportedTransactions?: (string[]|null);

        /** PluginConfig fileDescriptorProtos */
        fileDescriptorProtos?: (Uint8Array[]|null);

        /** PluginConfig transactionTypeUrls */
        transactionTypeUrls?: (string[]|null);

        /** PluginConfig eventTypeUrls */
        eventTypeUrls?: (string[]|null);
    }

    /** Represents a PluginConfig. */
    class PluginConfig implements IPluginConfig {

        /**
         * Constructs a new PluginConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginConfig);

        /** PluginConfig name. */
        public name: string;

        /** PluginConfig id. */
        public id: (number|Long);

        /** PluginConfig version. */
        public version: (number|Long);

        /** PluginConfig supportedTransactions. */
        public supportedTransactions: string[];

        /** PluginConfig fileDescriptorProtos. */
        public fileDescriptorProtos: Uint8Array[];

        /** PluginConfig transactionTypeUrls. */
        public transactionTypeUrls: string[];

        /** PluginConfig eventTypeUrls. */
        public eventTypeUrls: string[];

        /**
         * Creates a new PluginConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginConfig instance
         */
        public static create(properties?: types.IPluginConfig): types.PluginConfig;

        /**
         * Encodes the specified PluginConfig message. Does not implicitly {@link types.PluginConfig.verify|verify} messages.
         * @param message PluginConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginConfig message, length delimited. Does not implicitly {@link types.PluginConfig.verify|verify} messages.
         * @param message PluginConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginConfig;

        /**
         * Decodes a PluginConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginConfig;

        /**
         * Verifies a PluginConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginConfig
         */
        public static fromObject(object: { [k: string]: any }): types.PluginConfig;

        /**
         * Creates a plain object from a PluginConfig message. Also converts values to other types if specified.
         * @param message PluginConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginFSMConfig. */
    interface IPluginFSMConfig {

        /** PluginFSMConfig config */
        config?: (types.IPluginConfig|null);
    }

    /** Represents a PluginFSMConfig. */
    class PluginFSMConfig implements IPluginFSMConfig {

        /**
         * Constructs a new PluginFSMConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginFSMConfig);

        /** PluginFSMConfig config. */
        public config?: (types.IPluginConfig|null);

        /**
         * Creates a new PluginFSMConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginFSMConfig instance
         */
        public static create(properties?: types.IPluginFSMConfig): types.PluginFSMConfig;

        /**
         * Encodes the specified PluginFSMConfig message. Does not implicitly {@link types.PluginFSMConfig.verify|verify} messages.
         * @param message PluginFSMConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginFSMConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginFSMConfig message, length delimited. Does not implicitly {@link types.PluginFSMConfig.verify|verify} messages.
         * @param message PluginFSMConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginFSMConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginFSMConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginFSMConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginFSMConfig;

        /**
         * Decodes a PluginFSMConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginFSMConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginFSMConfig;

        /**
         * Verifies a PluginFSMConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginFSMConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginFSMConfig
         */
        public static fromObject(object: { [k: string]: any }): types.PluginFSMConfig;

        /**
         * Creates a plain object from a PluginFSMConfig message. Also converts values to other types if specified.
         * @param message PluginFSMConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginFSMConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginFSMConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginFSMConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginGenesisRequest. */
    interface IPluginGenesisRequest {

        /** PluginGenesisRequest genesisJson */
        genesisJson?: (Uint8Array|null);
    }

    /** Represents a PluginGenesisRequest. */
    class PluginGenesisRequest implements IPluginGenesisRequest {

        /**
         * Constructs a new PluginGenesisRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginGenesisRequest);

        /** PluginGenesisRequest genesisJson. */
        public genesisJson: Uint8Array;

        /**
         * Creates a new PluginGenesisRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginGenesisRequest instance
         */
        public static create(properties?: types.IPluginGenesisRequest): types.PluginGenesisRequest;

        /**
         * Encodes the specified PluginGenesisRequest message. Does not implicitly {@link types.PluginGenesisRequest.verify|verify} messages.
         * @param message PluginGenesisRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginGenesisRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginGenesisRequest message, length delimited. Does not implicitly {@link types.PluginGenesisRequest.verify|verify} messages.
         * @param message PluginGenesisRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginGenesisRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginGenesisRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginGenesisRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginGenesisRequest;

        /**
         * Decodes a PluginGenesisRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginGenesisRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginGenesisRequest;

        /**
         * Verifies a PluginGenesisRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginGenesisRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginGenesisRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginGenesisRequest;

        /**
         * Creates a plain object from a PluginGenesisRequest message. Also converts values to other types if specified.
         * @param message PluginGenesisRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginGenesisRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginGenesisRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginGenesisRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginGenesisResponse. */
    interface IPluginGenesisResponse {

        /** PluginGenesisResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginGenesisResponse. */
    class PluginGenesisResponse implements IPluginGenesisResponse {

        /**
         * Constructs a new PluginGenesisResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginGenesisResponse);

        /** PluginGenesisResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginGenesisResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginGenesisResponse instance
         */
        public static create(properties?: types.IPluginGenesisResponse): types.PluginGenesisResponse;

        /**
         * Encodes the specified PluginGenesisResponse message. Does not implicitly {@link types.PluginGenesisResponse.verify|verify} messages.
         * @param message PluginGenesisResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginGenesisResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginGenesisResponse message, length delimited. Does not implicitly {@link types.PluginGenesisResponse.verify|verify} messages.
         * @param message PluginGenesisResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginGenesisResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginGenesisResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginGenesisResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginGenesisResponse;

        /**
         * Decodes a PluginGenesisResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginGenesisResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginGenesisResponse;

        /**
         * Verifies a PluginGenesisResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginGenesisResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginGenesisResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginGenesisResponse;

        /**
         * Creates a plain object from a PluginGenesisResponse message. Also converts values to other types if specified.
         * @param message PluginGenesisResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginGenesisResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginGenesisResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginGenesisResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginBeginRequest. */
    interface IPluginBeginRequest {

        /** PluginBeginRequest height */
        height?: (number|Long|null);
    }

    /** Represents a PluginBeginRequest. */
    class PluginBeginRequest implements IPluginBeginRequest {

        /**
         * Constructs a new PluginBeginRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginBeginRequest);

        /** PluginBeginRequest height. */
        public height: (number|Long);

        /**
         * Creates a new PluginBeginRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginBeginRequest instance
         */
        public static create(properties?: types.IPluginBeginRequest): types.PluginBeginRequest;

        /**
         * Encodes the specified PluginBeginRequest message. Does not implicitly {@link types.PluginBeginRequest.verify|verify} messages.
         * @param message PluginBeginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginBeginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginBeginRequest message, length delimited. Does not implicitly {@link types.PluginBeginRequest.verify|verify} messages.
         * @param message PluginBeginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginBeginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginBeginRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginBeginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginBeginRequest;

        /**
         * Decodes a PluginBeginRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginBeginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginBeginRequest;

        /**
         * Verifies a PluginBeginRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginBeginRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginBeginRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginBeginRequest;

        /**
         * Creates a plain object from a PluginBeginRequest message. Also converts values to other types if specified.
         * @param message PluginBeginRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginBeginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginBeginRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginBeginRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginBeginResponse. */
    interface IPluginBeginResponse {

        /** PluginBeginResponse events */
        events?: (types.IEvent[]|null);

        /** PluginBeginResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginBeginResponse. */
    class PluginBeginResponse implements IPluginBeginResponse {

        /**
         * Constructs a new PluginBeginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginBeginResponse);

        /** PluginBeginResponse events. */
        public events: types.IEvent[];

        /** PluginBeginResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginBeginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginBeginResponse instance
         */
        public static create(properties?: types.IPluginBeginResponse): types.PluginBeginResponse;

        /**
         * Encodes the specified PluginBeginResponse message. Does not implicitly {@link types.PluginBeginResponse.verify|verify} messages.
         * @param message PluginBeginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginBeginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginBeginResponse message, length delimited. Does not implicitly {@link types.PluginBeginResponse.verify|verify} messages.
         * @param message PluginBeginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginBeginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginBeginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginBeginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginBeginResponse;

        /**
         * Decodes a PluginBeginResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginBeginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginBeginResponse;

        /**
         * Verifies a PluginBeginResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginBeginResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginBeginResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginBeginResponse;

        /**
         * Creates a plain object from a PluginBeginResponse message. Also converts values to other types if specified.
         * @param message PluginBeginResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginBeginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginBeginResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginBeginResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginCheckRequest. */
    interface IPluginCheckRequest {

        /** PluginCheckRequest tx */
        tx?: (types.ITransaction|null);
    }

    /** Represents a PluginCheckRequest. */
    class PluginCheckRequest implements IPluginCheckRequest {

        /**
         * Constructs a new PluginCheckRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginCheckRequest);

        /** PluginCheckRequest tx. */
        public tx?: (types.ITransaction|null);

        /**
         * Creates a new PluginCheckRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginCheckRequest instance
         */
        public static create(properties?: types.IPluginCheckRequest): types.PluginCheckRequest;

        /**
         * Encodes the specified PluginCheckRequest message. Does not implicitly {@link types.PluginCheckRequest.verify|verify} messages.
         * @param message PluginCheckRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginCheckRequest message, length delimited. Does not implicitly {@link types.PluginCheckRequest.verify|verify} messages.
         * @param message PluginCheckRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginCheckRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginCheckRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginCheckRequest;

        /**
         * Decodes a PluginCheckRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginCheckRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginCheckRequest;

        /**
         * Verifies a PluginCheckRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginCheckRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginCheckRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginCheckRequest;

        /**
         * Creates a plain object from a PluginCheckRequest message. Also converts values to other types if specified.
         * @param message PluginCheckRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginCheckRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginCheckRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginCheckRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginCheckResponse. */
    interface IPluginCheckResponse {

        /** PluginCheckResponse authorizedSigners */
        authorizedSigners?: (Uint8Array[]|null);

        /** PluginCheckResponse recipient */
        recipient?: (Uint8Array|null);

        /** PluginCheckResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginCheckResponse. */
    class PluginCheckResponse implements IPluginCheckResponse {

        /**
         * Constructs a new PluginCheckResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginCheckResponse);

        /** PluginCheckResponse authorizedSigners. */
        public authorizedSigners: Uint8Array[];

        /** PluginCheckResponse recipient. */
        public recipient: Uint8Array;

        /** PluginCheckResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginCheckResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginCheckResponse instance
         */
        public static create(properties?: types.IPluginCheckResponse): types.PluginCheckResponse;

        /**
         * Encodes the specified PluginCheckResponse message. Does not implicitly {@link types.PluginCheckResponse.verify|verify} messages.
         * @param message PluginCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginCheckResponse message, length delimited. Does not implicitly {@link types.PluginCheckResponse.verify|verify} messages.
         * @param message PluginCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginCheckResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginCheckResponse;

        /**
         * Decodes a PluginCheckResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginCheckResponse;

        /**
         * Verifies a PluginCheckResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginCheckResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginCheckResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginCheckResponse;

        /**
         * Creates a plain object from a PluginCheckResponse message. Also converts values to other types if specified.
         * @param message PluginCheckResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginCheckResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginCheckResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginCheckResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeliverRequest. */
    interface IPluginDeliverRequest {

        /** PluginDeliverRequest tx */
        tx?: (types.ITransaction|null);
    }

    /** Represents a PluginDeliverRequest. */
    class PluginDeliverRequest implements IPluginDeliverRequest {

        /**
         * Constructs a new PluginDeliverRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeliverRequest);

        /** PluginDeliverRequest tx. */
        public tx?: (types.ITransaction|null);

        /**
         * Creates a new PluginDeliverRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeliverRequest instance
         */
        public static create(properties?: types.IPluginDeliverRequest): types.PluginDeliverRequest;

        /**
         * Encodes the specified PluginDeliverRequest message. Does not implicitly {@link types.PluginDeliverRequest.verify|verify} messages.
         * @param message PluginDeliverRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeliverRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeliverRequest message, length delimited. Does not implicitly {@link types.PluginDeliverRequest.verify|verify} messages.
         * @param message PluginDeliverRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeliverRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeliverRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeliverRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeliverRequest;

        /**
         * Decodes a PluginDeliverRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeliverRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeliverRequest;

        /**
         * Verifies a PluginDeliverRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeliverRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeliverRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeliverRequest;

        /**
         * Creates a plain object from a PluginDeliverRequest message. Also converts values to other types if specified.
         * @param message PluginDeliverRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeliverRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeliverRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeliverRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeliverResponse. */
    interface IPluginDeliverResponse {

        /** PluginDeliverResponse events */
        events?: (types.IEvent[]|null);

        /** PluginDeliverResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginDeliverResponse. */
    class PluginDeliverResponse implements IPluginDeliverResponse {

        /**
         * Constructs a new PluginDeliverResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeliverResponse);

        /** PluginDeliverResponse events. */
        public events: types.IEvent[];

        /** PluginDeliverResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginDeliverResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeliverResponse instance
         */
        public static create(properties?: types.IPluginDeliverResponse): types.PluginDeliverResponse;

        /**
         * Encodes the specified PluginDeliverResponse message. Does not implicitly {@link types.PluginDeliverResponse.verify|verify} messages.
         * @param message PluginDeliverResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeliverResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeliverResponse message, length delimited. Does not implicitly {@link types.PluginDeliverResponse.verify|verify} messages.
         * @param message PluginDeliverResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeliverResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeliverResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeliverResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeliverResponse;

        /**
         * Decodes a PluginDeliverResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeliverResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeliverResponse;

        /**
         * Verifies a PluginDeliverResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeliverResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeliverResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeliverResponse;

        /**
         * Creates a plain object from a PluginDeliverResponse message. Also converts values to other types if specified.
         * @param message PluginDeliverResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeliverResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeliverResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeliverResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginEndRequest. */
    interface IPluginEndRequest {

        /** PluginEndRequest height */
        height?: (number|Long|null);

        /** PluginEndRequest proposerAddress */
        proposerAddress?: (Uint8Array|null);
    }

    /** Represents a PluginEndRequest. */
    class PluginEndRequest implements IPluginEndRequest {

        /**
         * Constructs a new PluginEndRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginEndRequest);

        /** PluginEndRequest height. */
        public height: (number|Long);

        /** PluginEndRequest proposerAddress. */
        public proposerAddress: Uint8Array;

        /**
         * Creates a new PluginEndRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginEndRequest instance
         */
        public static create(properties?: types.IPluginEndRequest): types.PluginEndRequest;

        /**
         * Encodes the specified PluginEndRequest message. Does not implicitly {@link types.PluginEndRequest.verify|verify} messages.
         * @param message PluginEndRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginEndRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginEndRequest message, length delimited. Does not implicitly {@link types.PluginEndRequest.verify|verify} messages.
         * @param message PluginEndRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginEndRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginEndRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginEndRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginEndRequest;

        /**
         * Decodes a PluginEndRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginEndRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginEndRequest;

        /**
         * Verifies a PluginEndRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginEndRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginEndRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginEndRequest;

        /**
         * Creates a plain object from a PluginEndRequest message. Also converts values to other types if specified.
         * @param message PluginEndRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginEndRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginEndRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginEndRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginEndResponse. */
    interface IPluginEndResponse {

        /** PluginEndResponse events */
        events?: (types.IEvent[]|null);

        /** PluginEndResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginEndResponse. */
    class PluginEndResponse implements IPluginEndResponse {

        /**
         * Constructs a new PluginEndResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginEndResponse);

        /** PluginEndResponse events. */
        public events: types.IEvent[];

        /** PluginEndResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginEndResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginEndResponse instance
         */
        public static create(properties?: types.IPluginEndResponse): types.PluginEndResponse;

        /**
         * Encodes the specified PluginEndResponse message. Does not implicitly {@link types.PluginEndResponse.verify|verify} messages.
         * @param message PluginEndResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginEndResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginEndResponse message, length delimited. Does not implicitly {@link types.PluginEndResponse.verify|verify} messages.
         * @param message PluginEndResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginEndResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginEndResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginEndResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginEndResponse;

        /**
         * Decodes a PluginEndResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginEndResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginEndResponse;

        /**
         * Verifies a PluginEndResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginEndResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginEndResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginEndResponse;

        /**
         * Creates a plain object from a PluginEndResponse message. Also converts values to other types if specified.
         * @param message PluginEndResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginEndResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginEndResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginEndResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginError. */
    interface IPluginError {

        /** PluginError code */
        code?: (number|Long|null);

        /** PluginError module */
        module?: (string|null);

        /** PluginError msg */
        msg?: (string|null);
    }

    /** Represents a PluginError. */
    class PluginError implements IPluginError {

        /**
         * Constructs a new PluginError.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginError);

        /** PluginError code. */
        public code: (number|Long);

        /** PluginError module. */
        public module: string;

        /** PluginError msg. */
        public msg: string;

        /**
         * Creates a new PluginError instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginError instance
         */
        public static create(properties?: types.IPluginError): types.PluginError;

        /**
         * Encodes the specified PluginError message. Does not implicitly {@link types.PluginError.verify|verify} messages.
         * @param message PluginError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginError message, length delimited. Does not implicitly {@link types.PluginError.verify|verify} messages.
         * @param message PluginError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginError message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginError;

        /**
         * Decodes a PluginError message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginError;

        /**
         * Verifies a PluginError message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginError message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginError
         */
        public static fromObject(object: { [k: string]: any }): types.PluginError;

        /**
         * Creates a plain object from a PluginError message. Also converts values to other types if specified.
         * @param message PluginError
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginError, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginError to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginError
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateReadRequest. */
    interface IPluginStateReadRequest {

        /** PluginStateReadRequest keys */
        keys?: (types.IPluginKeyRead[]|null);

        /** PluginStateReadRequest ranges */
        ranges?: (types.IPluginRangeRead[]|null);
    }

    /** Represents a PluginStateReadRequest. */
    class PluginStateReadRequest implements IPluginStateReadRequest {

        /**
         * Constructs a new PluginStateReadRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateReadRequest);

        /** PluginStateReadRequest keys. */
        public keys: types.IPluginKeyRead[];

        /** PluginStateReadRequest ranges. */
        public ranges: types.IPluginRangeRead[];

        /**
         * Creates a new PluginStateReadRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateReadRequest instance
         */
        public static create(properties?: types.IPluginStateReadRequest): types.PluginStateReadRequest;

        /**
         * Encodes the specified PluginStateReadRequest message. Does not implicitly {@link types.PluginStateReadRequest.verify|verify} messages.
         * @param message PluginStateReadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateReadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateReadRequest message, length delimited. Does not implicitly {@link types.PluginStateReadRequest.verify|verify} messages.
         * @param message PluginStateReadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateReadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateReadRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateReadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateReadRequest;

        /**
         * Decodes a PluginStateReadRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateReadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateReadRequest;

        /**
         * Verifies a PluginStateReadRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateReadRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateReadRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateReadRequest;

        /**
         * Creates a plain object from a PluginStateReadRequest message. Also converts values to other types if specified.
         * @param message PluginStateReadRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateReadRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateReadRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateReadRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginKeyRead. */
    interface IPluginKeyRead {

        /** PluginKeyRead queryId */
        queryId?: (number|Long|null);

        /** PluginKeyRead key */
        key?: (Uint8Array|null);
    }

    /** Represents a PluginKeyRead. */
    class PluginKeyRead implements IPluginKeyRead {

        /**
         * Constructs a new PluginKeyRead.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginKeyRead);

        /** PluginKeyRead queryId. */
        public queryId: (number|Long);

        /** PluginKeyRead key. */
        public key: Uint8Array;

        /**
         * Creates a new PluginKeyRead instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginKeyRead instance
         */
        public static create(properties?: types.IPluginKeyRead): types.PluginKeyRead;

        /**
         * Encodes the specified PluginKeyRead message. Does not implicitly {@link types.PluginKeyRead.verify|verify} messages.
         * @param message PluginKeyRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginKeyRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginKeyRead message, length delimited. Does not implicitly {@link types.PluginKeyRead.verify|verify} messages.
         * @param message PluginKeyRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginKeyRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginKeyRead message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginKeyRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginKeyRead;

        /**
         * Decodes a PluginKeyRead message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginKeyRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginKeyRead;

        /**
         * Verifies a PluginKeyRead message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginKeyRead message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginKeyRead
         */
        public static fromObject(object: { [k: string]: any }): types.PluginKeyRead;

        /**
         * Creates a plain object from a PluginKeyRead message. Also converts values to other types if specified.
         * @param message PluginKeyRead
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginKeyRead, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginKeyRead to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginKeyRead
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginRangeRead. */
    interface IPluginRangeRead {

        /** PluginRangeRead queryId */
        queryId?: (number|Long|null);

        /** PluginRangeRead prefix */
        prefix?: (Uint8Array|null);

        /** PluginRangeRead limit */
        limit?: (number|Long|null);

        /** PluginRangeRead reverse */
        reverse?: (boolean|null);
    }

    /** Represents a PluginRangeRead. */
    class PluginRangeRead implements IPluginRangeRead {

        /**
         * Constructs a new PluginRangeRead.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginRangeRead);

        /** PluginRangeRead queryId. */
        public queryId: (number|Long);

        /** PluginRangeRead prefix. */
        public prefix: Uint8Array;

        /** PluginRangeRead limit. */
        public limit: (number|Long);

        /** PluginRangeRead reverse. */
        public reverse: boolean;

        /**
         * Creates a new PluginRangeRead instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginRangeRead instance
         */
        public static create(properties?: types.IPluginRangeRead): types.PluginRangeRead;

        /**
         * Encodes the specified PluginRangeRead message. Does not implicitly {@link types.PluginRangeRead.verify|verify} messages.
         * @param message PluginRangeRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginRangeRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginRangeRead message, length delimited. Does not implicitly {@link types.PluginRangeRead.verify|verify} messages.
         * @param message PluginRangeRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginRangeRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginRangeRead message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginRangeRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginRangeRead;

        /**
         * Decodes a PluginRangeRead message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginRangeRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginRangeRead;

        /**
         * Verifies a PluginRangeRead message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginRangeRead message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginRangeRead
         */
        public static fromObject(object: { [k: string]: any }): types.PluginRangeRead;

        /**
         * Creates a plain object from a PluginRangeRead message. Also converts values to other types if specified.
         * @param message PluginRangeRead
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginRangeRead, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginRangeRead to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginRangeRead
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateReadResponse. */
    interface IPluginStateReadResponse {

        /** PluginStateReadResponse results */
        results?: (types.IPluginReadResult[]|null);

        /** PluginStateReadResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginStateReadResponse. */
    class PluginStateReadResponse implements IPluginStateReadResponse {

        /**
         * Constructs a new PluginStateReadResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateReadResponse);

        /** PluginStateReadResponse results. */
        public results: types.IPluginReadResult[];

        /** PluginStateReadResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginStateReadResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateReadResponse instance
         */
        public static create(properties?: types.IPluginStateReadResponse): types.PluginStateReadResponse;

        /**
         * Encodes the specified PluginStateReadResponse message. Does not implicitly {@link types.PluginStateReadResponse.verify|verify} messages.
         * @param message PluginStateReadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateReadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateReadResponse message, length delimited. Does not implicitly {@link types.PluginStateReadResponse.verify|verify} messages.
         * @param message PluginStateReadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateReadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateReadResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateReadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateReadResponse;

        /**
         * Decodes a PluginStateReadResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateReadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateReadResponse;

        /**
         * Verifies a PluginStateReadResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateReadResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateReadResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateReadResponse;

        /**
         * Creates a plain object from a PluginStateReadResponse message. Also converts values to other types if specified.
         * @param message PluginStateReadResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateReadResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateReadResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateReadResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginReadResult. */
    interface IPluginReadResult {

        /** PluginReadResult queryId */
        queryId?: (number|Long|null);

        /** PluginReadResult entries */
        entries?: (types.IPluginStateEntry[]|null);
    }

    /** Represents a PluginReadResult. */
    class PluginReadResult implements IPluginReadResult {

        /**
         * Constructs a new PluginReadResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginReadResult);

        /** PluginReadResult queryId. */
        public queryId: (number|Long);

        /** PluginReadResult entries. */
        public entries: types.IPluginStateEntry[];

        /**
         * Creates a new PluginReadResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginReadResult instance
         */
        public static create(properties?: types.IPluginReadResult): types.PluginReadResult;

        /**
         * Encodes the specified PluginReadResult message. Does not implicitly {@link types.PluginReadResult.verify|verify} messages.
         * @param message PluginReadResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginReadResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginReadResult message, length delimited. Does not implicitly {@link types.PluginReadResult.verify|verify} messages.
         * @param message PluginReadResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginReadResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginReadResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginReadResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginReadResult;

        /**
         * Decodes a PluginReadResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginReadResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginReadResult;

        /**
         * Verifies a PluginReadResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginReadResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginReadResult
         */
        public static fromObject(object: { [k: string]: any }): types.PluginReadResult;

        /**
         * Creates a plain object from a PluginReadResult message. Also converts values to other types if specified.
         * @param message PluginReadResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginReadResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginReadResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginReadResult
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateWriteRequest. */
    interface IPluginStateWriteRequest {

        /** PluginStateWriteRequest sets */
        sets?: (types.IPluginSetOp[]|null);

        /** PluginStateWriteRequest deletes */
        deletes?: (types.IPluginDeleteOp[]|null);
    }

    /** Represents a PluginStateWriteRequest. */
    class PluginStateWriteRequest implements IPluginStateWriteRequest {

        /**
         * Constructs a new PluginStateWriteRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateWriteRequest);

        /** PluginStateWriteRequest sets. */
        public sets: types.IPluginSetOp[];

        /** PluginStateWriteRequest deletes. */
        public deletes: types.IPluginDeleteOp[];

        /**
         * Creates a new PluginStateWriteRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateWriteRequest instance
         */
        public static create(properties?: types.IPluginStateWriteRequest): types.PluginStateWriteRequest;

        /**
         * Encodes the specified PluginStateWriteRequest message. Does not implicitly {@link types.PluginStateWriteRequest.verify|verify} messages.
         * @param message PluginStateWriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateWriteRequest message, length delimited. Does not implicitly {@link types.PluginStateWriteRequest.verify|verify} messages.
         * @param message PluginStateWriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateWriteRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateWriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateWriteRequest;

        /**
         * Decodes a PluginStateWriteRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateWriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateWriteRequest;

        /**
         * Verifies a PluginStateWriteRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateWriteRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateWriteRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateWriteRequest;

        /**
         * Creates a plain object from a PluginStateWriteRequest message. Also converts values to other types if specified.
         * @param message PluginStateWriteRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateWriteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateWriteRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateWriteRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateWriteResponse. */
    interface IPluginStateWriteResponse {

        /** PluginStateWriteResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginStateWriteResponse. */
    class PluginStateWriteResponse implements IPluginStateWriteResponse {

        /**
         * Constructs a new PluginStateWriteResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateWriteResponse);

        /** PluginStateWriteResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginStateWriteResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateWriteResponse instance
         */
        public static create(properties?: types.IPluginStateWriteResponse): types.PluginStateWriteResponse;

        /**
         * Encodes the specified PluginStateWriteResponse message. Does not implicitly {@link types.PluginStateWriteResponse.verify|verify} messages.
         * @param message PluginStateWriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateWriteResponse message, length delimited. Does not implicitly {@link types.PluginStateWriteResponse.verify|verify} messages.
         * @param message PluginStateWriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateWriteResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateWriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateWriteResponse;

        /**
         * Decodes a PluginStateWriteResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateWriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateWriteResponse;

        /**
         * Verifies a PluginStateWriteResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateWriteResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateWriteResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateWriteResponse;

        /**
         * Creates a plain object from a PluginStateWriteResponse message. Also converts values to other types if specified.
         * @param message PluginStateWriteResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateWriteResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateWriteResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateWriteResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginSetOp. */
    interface IPluginSetOp {

        /** PluginSetOp key */
        key?: (Uint8Array|null);

        /** PluginSetOp value */
        value?: (Uint8Array|null);
    }

    /** Represents a PluginSetOp. */
    class PluginSetOp implements IPluginSetOp {

        /**
         * Constructs a new PluginSetOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginSetOp);

        /** PluginSetOp key. */
        public key: Uint8Array;

        /** PluginSetOp value. */
        public value: Uint8Array;

        /**
         * Creates a new PluginSetOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginSetOp instance
         */
        public static create(properties?: types.IPluginSetOp): types.PluginSetOp;

        /**
         * Encodes the specified PluginSetOp message. Does not implicitly {@link types.PluginSetOp.verify|verify} messages.
         * @param message PluginSetOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginSetOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginSetOp message, length delimited. Does not implicitly {@link types.PluginSetOp.verify|verify} messages.
         * @param message PluginSetOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginSetOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginSetOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginSetOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginSetOp;

        /**
         * Decodes a PluginSetOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginSetOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginSetOp;

        /**
         * Verifies a PluginSetOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginSetOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginSetOp
         */
        public static fromObject(object: { [k: string]: any }): types.PluginSetOp;

        /**
         * Creates a plain object from a PluginSetOp message. Also converts values to other types if specified.
         * @param message PluginSetOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginSetOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginSetOp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginSetOp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeleteOp. */
    interface IPluginDeleteOp {

        /** PluginDeleteOp key */
        key?: (Uint8Array|null);
    }

    /** Represents a PluginDeleteOp. */
    class PluginDeleteOp implements IPluginDeleteOp {

        /**
         * Constructs a new PluginDeleteOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeleteOp);

        /** PluginDeleteOp key. */
        public key: Uint8Array;

        /**
         * Creates a new PluginDeleteOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeleteOp instance
         */
        public static create(properties?: types.IPluginDeleteOp): types.PluginDeleteOp;

        /**
         * Encodes the specified PluginDeleteOp message. Does not implicitly {@link types.PluginDeleteOp.verify|verify} messages.
         * @param message PluginDeleteOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeleteOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeleteOp message, length delimited. Does not implicitly {@link types.PluginDeleteOp.verify|verify} messages.
         * @param message PluginDeleteOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeleteOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeleteOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeleteOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeleteOp;

        /**
         * Decodes a PluginDeleteOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeleteOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeleteOp;

        /**
         * Verifies a PluginDeleteOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeleteOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeleteOp
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeleteOp;

        /**
         * Creates a plain object from a PluginDeleteOp message. Also converts values to other types if specified.
         * @param message PluginDeleteOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeleteOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeleteOp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeleteOp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateEntry. */
    interface IPluginStateEntry {

        /** PluginStateEntry key */
        key?: (Uint8Array|null);

        /** PluginStateEntry value */
        value?: (Uint8Array|null);
    }

    /** Represents a PluginStateEntry. */
    class PluginStateEntry implements IPluginStateEntry {

        /**
         * Constructs a new PluginStateEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateEntry);

        /** PluginStateEntry key. */
        public key: Uint8Array;

        /** PluginStateEntry value. */
        public value: Uint8Array;

        /**
         * Creates a new PluginStateEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateEntry instance
         */
        public static create(properties?: types.IPluginStateEntry): types.PluginStateEntry;

        /**
         * Encodes the specified PluginStateEntry message. Does not implicitly {@link types.PluginStateEntry.verify|verify} messages.
         * @param message PluginStateEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateEntry message, length delimited. Does not implicitly {@link types.PluginStateEntry.verify|verify} messages.
         * @param message PluginStateEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateEntry;

        /**
         * Decodes a PluginStateEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateEntry;

        /**
         * Verifies a PluginStateEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateEntry
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateEntry;

        /**
         * Creates a plain object from a PluginStateEntry message. Also converts values to other types if specified.
         * @param message PluginStateEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Transaction. */
    interface ITransaction {

        /** Transaction messageType */
        messageType?: (string|null);

        /** Transaction msg */
        msg?: (google.protobuf.IAny|null);

        /** Transaction signature */
        signature?: (types.ISignature|null);

        /** Transaction createdHeight */
        createdHeight?: (number|Long|null);

        /** Transaction time */
        time?: (number|Long|null);

        /** Transaction fee */
        fee?: (number|Long|null);

        /** Transaction memo */
        memo?: (string|null);

        /** Transaction networkId */
        networkId?: (number|Long|null);

        /** Transaction chainId */
        chainId?: (number|Long|null);
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {

        /**
         * Constructs a new Transaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.ITransaction);

        /** Transaction messageType. */
        public messageType: string;

        /** Transaction msg. */
        public msg?: (google.protobuf.IAny|null);

        /** Transaction signature. */
        public signature?: (types.ISignature|null);

        /** Transaction createdHeight. */
        public createdHeight: (number|Long);

        /** Transaction time. */
        public time: (number|Long);

        /** Transaction fee. */
        public fee: (number|Long);

        /** Transaction memo. */
        public memo: string;

        /** Transaction networkId. */
        public networkId: (number|Long);

        /** Transaction chainId. */
        public chainId: (number|Long);

        /**
         * Creates a new Transaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transaction instance
         */
        public static create(properties?: types.ITransaction): types.Transaction;

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link types.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link types.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Transaction;

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Transaction;

        /**
         * Verifies a Transaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transaction
         */
        public static fromObject(object: { [k: string]: any }): types.Transaction;

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @param message Transaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Transaction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateProfile. */
    interface IMessageCreateProfile {

        /** MessageCreateProfile senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageCreateProfile username */
        username?: (string|null);

        /** MessageCreateProfile bio */
        bio?: (string|null);

        /** MessageCreateProfile avatarUrl */
        avatarUrl?: (string|null);
    }

    /** Represents a MessageCreateProfile. */
    class MessageCreateProfile implements IMessageCreateProfile {

        /**
         * Constructs a new MessageCreateProfile.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateProfile);

        /** MessageCreateProfile senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageCreateProfile username. */
        public username: string;

        /** MessageCreateProfile bio. */
        public bio: string;

        /** MessageCreateProfile avatarUrl. */
        public avatarUrl: string;

        /**
         * Creates a new MessageCreateProfile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateProfile instance
         */
        public static create(properties?: types.IMessageCreateProfile): types.MessageCreateProfile;

        /**
         * Encodes the specified MessageCreateProfile message. Does not implicitly {@link types.MessageCreateProfile.verify|verify} messages.
         * @param message MessageCreateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateProfile message, length delimited. Does not implicitly {@link types.MessageCreateProfile.verify|verify} messages.
         * @param message MessageCreateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateProfile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateProfile;

        /**
         * Decodes a MessageCreateProfile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateProfile;

        /**
         * Verifies a MessageCreateProfile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateProfile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateProfile
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateProfile;

        /**
         * Creates a plain object from a MessageCreateProfile message. Also converts values to other types if specified.
         * @param message MessageCreateProfile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateProfile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateProfile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageUpdateProfile. */
    interface IMessageUpdateProfile {

        /** MessageUpdateProfile senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageUpdateProfile bio */
        bio?: (string|null);

        /** MessageUpdateProfile avatarUrl */
        avatarUrl?: (string|null);
    }

    /** Represents a MessageUpdateProfile. */
    class MessageUpdateProfile implements IMessageUpdateProfile {

        /**
         * Constructs a new MessageUpdateProfile.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageUpdateProfile);

        /** MessageUpdateProfile senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageUpdateProfile bio. */
        public bio: string;

        /** MessageUpdateProfile avatarUrl. */
        public avatarUrl: string;

        /**
         * Creates a new MessageUpdateProfile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageUpdateProfile instance
         */
        public static create(properties?: types.IMessageUpdateProfile): types.MessageUpdateProfile;

        /**
         * Encodes the specified MessageUpdateProfile message. Does not implicitly {@link types.MessageUpdateProfile.verify|verify} messages.
         * @param message MessageUpdateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageUpdateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageUpdateProfile message, length delimited. Does not implicitly {@link types.MessageUpdateProfile.verify|verify} messages.
         * @param message MessageUpdateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageUpdateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageUpdateProfile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageUpdateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageUpdateProfile;

        /**
         * Decodes a MessageUpdateProfile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageUpdateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageUpdateProfile;

        /**
         * Verifies a MessageUpdateProfile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageUpdateProfile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageUpdateProfile
         */
        public static fromObject(object: { [k: string]: any }): types.MessageUpdateProfile;

        /**
         * Creates a plain object from a MessageUpdateProfile message. Also converts values to other types if specified.
         * @param message MessageUpdateProfile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageUpdateProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageUpdateProfile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageUpdateProfile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateCircle. */
    interface IMessageCreateCircle {

        /** MessageCreateCircle senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageCreateCircle circleId */
        circleId?: (string|null);

        /** MessageCreateCircle name */
        name?: (string|null);

        /** MessageCreateCircle description */
        description?: (string|null);
    }

    /** Represents a MessageCreateCircle. */
    class MessageCreateCircle implements IMessageCreateCircle {

        /**
         * Constructs a new MessageCreateCircle.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateCircle);

        /** MessageCreateCircle senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageCreateCircle circleId. */
        public circleId: string;

        /** MessageCreateCircle name. */
        public name: string;

        /** MessageCreateCircle description. */
        public description: string;

        /**
         * Creates a new MessageCreateCircle instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateCircle instance
         */
        public static create(properties?: types.IMessageCreateCircle): types.MessageCreateCircle;

        /**
         * Encodes the specified MessageCreateCircle message. Does not implicitly {@link types.MessageCreateCircle.verify|verify} messages.
         * @param message MessageCreateCircle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateCircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateCircle message, length delimited. Does not implicitly {@link types.MessageCreateCircle.verify|verify} messages.
         * @param message MessageCreateCircle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateCircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateCircle message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateCircle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateCircle;

        /**
         * Decodes a MessageCreateCircle message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateCircle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateCircle;

        /**
         * Verifies a MessageCreateCircle message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateCircle message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateCircle
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateCircle;

        /**
         * Creates a plain object from a MessageCreateCircle message. Also converts values to other types if specified.
         * @param message MessageCreateCircle
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateCircle, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateCircle to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateCircle
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageJoinCircle. */
    interface IMessageJoinCircle {

        /** MessageJoinCircle senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageJoinCircle circleId */
        circleId?: (string|null);
    }

    /** Represents a MessageJoinCircle. */
    class MessageJoinCircle implements IMessageJoinCircle {

        /**
         * Constructs a new MessageJoinCircle.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageJoinCircle);

        /** MessageJoinCircle senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageJoinCircle circleId. */
        public circleId: string;

        /**
         * Creates a new MessageJoinCircle instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageJoinCircle instance
         */
        public static create(properties?: types.IMessageJoinCircle): types.MessageJoinCircle;

        /**
         * Encodes the specified MessageJoinCircle message. Does not implicitly {@link types.MessageJoinCircle.verify|verify} messages.
         * @param message MessageJoinCircle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageJoinCircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageJoinCircle message, length delimited. Does not implicitly {@link types.MessageJoinCircle.verify|verify} messages.
         * @param message MessageJoinCircle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageJoinCircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageJoinCircle message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageJoinCircle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageJoinCircle;

        /**
         * Decodes a MessageJoinCircle message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageJoinCircle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageJoinCircle;

        /**
         * Verifies a MessageJoinCircle message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageJoinCircle message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageJoinCircle
         */
        public static fromObject(object: { [k: string]: any }): types.MessageJoinCircle;

        /**
         * Creates a plain object from a MessageJoinCircle message. Also converts values to other types if specified.
         * @param message MessageJoinCircle
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageJoinCircle, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageJoinCircle to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageJoinCircle
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageEndorseUser. */
    interface IMessageEndorseUser {

        /** MessageEndorseUser senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageEndorseUser circleId */
        circleId?: (string|null);

        /** MessageEndorseUser targetAddress */
        targetAddress?: (Uint8Array|null);

        /** MessageEndorseUser tag */
        tag?: (string|null);

        /** MessageEndorseUser message */
        message?: (string|null);
    }

    /** Represents a MessageEndorseUser. */
    class MessageEndorseUser implements IMessageEndorseUser {

        /**
         * Constructs a new MessageEndorseUser.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageEndorseUser);

        /** MessageEndorseUser senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageEndorseUser circleId. */
        public circleId: string;

        /** MessageEndorseUser targetAddress. */
        public targetAddress: Uint8Array;

        /** MessageEndorseUser tag. */
        public tag: string;

        /** MessageEndorseUser message. */
        public message: string;

        /**
         * Creates a new MessageEndorseUser instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageEndorseUser instance
         */
        public static create(properties?: types.IMessageEndorseUser): types.MessageEndorseUser;

        /**
         * Encodes the specified MessageEndorseUser message. Does not implicitly {@link types.MessageEndorseUser.verify|verify} messages.
         * @param message MessageEndorseUser message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageEndorseUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageEndorseUser message, length delimited. Does not implicitly {@link types.MessageEndorseUser.verify|verify} messages.
         * @param message MessageEndorseUser message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageEndorseUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageEndorseUser message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageEndorseUser
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageEndorseUser;

        /**
         * Decodes a MessageEndorseUser message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageEndorseUser
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageEndorseUser;

        /**
         * Verifies a MessageEndorseUser message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageEndorseUser message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageEndorseUser
         */
        public static fromObject(object: { [k: string]: any }): types.MessageEndorseUser;

        /**
         * Creates a plain object from a MessageEndorseUser message. Also converts values to other types if specified.
         * @param message MessageEndorseUser
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageEndorseUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageEndorseUser to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageEndorseUser
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateContribution. */
    interface IMessageCreateContribution {

        /** MessageCreateContribution senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageCreateContribution contributionId */
        contributionId?: (string|null);

        /** MessageCreateContribution circleId */
        circleId?: (string|null);

        /** MessageCreateContribution title */
        title?: (string|null);

        /** MessageCreateContribution description */
        description?: (string|null);

        /** MessageCreateContribution proofUrl */
        proofUrl?: (string|null);

        /** MessageCreateContribution category */
        category?: (string|null);
    }

    /** Represents a MessageCreateContribution. */
    class MessageCreateContribution implements IMessageCreateContribution {

        /**
         * Constructs a new MessageCreateContribution.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateContribution);

        /** MessageCreateContribution senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageCreateContribution contributionId. */
        public contributionId: string;

        /** MessageCreateContribution circleId. */
        public circleId: string;

        /** MessageCreateContribution title. */
        public title: string;

        /** MessageCreateContribution description. */
        public description: string;

        /** MessageCreateContribution proofUrl. */
        public proofUrl: string;

        /** MessageCreateContribution category. */
        public category: string;

        /**
         * Creates a new MessageCreateContribution instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateContribution instance
         */
        public static create(properties?: types.IMessageCreateContribution): types.MessageCreateContribution;

        /**
         * Encodes the specified MessageCreateContribution message. Does not implicitly {@link types.MessageCreateContribution.verify|verify} messages.
         * @param message MessageCreateContribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateContribution message, length delimited. Does not implicitly {@link types.MessageCreateContribution.verify|verify} messages.
         * @param message MessageCreateContribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateContribution message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateContribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateContribution;

        /**
         * Decodes a MessageCreateContribution message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateContribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateContribution;

        /**
         * Verifies a MessageCreateContribution message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateContribution message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateContribution
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateContribution;

        /**
         * Creates a plain object from a MessageCreateContribution message. Also converts values to other types if specified.
         * @param message MessageCreateContribution
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateContribution, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateContribution to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateContribution
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageEndorseContribution. */
    interface IMessageEndorseContribution {

        /** MessageEndorseContribution senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageEndorseContribution contributionId */
        contributionId?: (string|null);

        /** MessageEndorseContribution tag */
        tag?: (string|null);

        /** MessageEndorseContribution message */
        message?: (string|null);
    }

    /** Represents a MessageEndorseContribution. */
    class MessageEndorseContribution implements IMessageEndorseContribution {

        /**
         * Constructs a new MessageEndorseContribution.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageEndorseContribution);

        /** MessageEndorseContribution senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageEndorseContribution contributionId. */
        public contributionId: string;

        /** MessageEndorseContribution tag. */
        public tag: string;

        /** MessageEndorseContribution message. */
        public message: string;

        /**
         * Creates a new MessageEndorseContribution instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageEndorseContribution instance
         */
        public static create(properties?: types.IMessageEndorseContribution): types.MessageEndorseContribution;

        /**
         * Encodes the specified MessageEndorseContribution message. Does not implicitly {@link types.MessageEndorseContribution.verify|verify} messages.
         * @param message MessageEndorseContribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageEndorseContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageEndorseContribution message, length delimited. Does not implicitly {@link types.MessageEndorseContribution.verify|verify} messages.
         * @param message MessageEndorseContribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageEndorseContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageEndorseContribution message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageEndorseContribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageEndorseContribution;

        /**
         * Decodes a MessageEndorseContribution message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageEndorseContribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageEndorseContribution;

        /**
         * Verifies a MessageEndorseContribution message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageEndorseContribution message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageEndorseContribution
         */
        public static fromObject(object: { [k: string]: any }): types.MessageEndorseContribution;

        /**
         * Creates a plain object from a MessageEndorseContribution message. Also converts values to other types if specified.
         * @param message MessageEndorseContribution
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageEndorseContribution, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageEndorseContribution to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageEndorseContribution
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageSlashEndorsement. */
    interface IMessageSlashEndorsement {

        /** MessageSlashEndorsement senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageSlashEndorsement endorsementId */
        endorsementId?: (string|null);

        /** MessageSlashEndorsement reason */
        reason?: (string|null);
    }

    /** Represents a MessageSlashEndorsement. */
    class MessageSlashEndorsement implements IMessageSlashEndorsement {

        /**
         * Constructs a new MessageSlashEndorsement.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageSlashEndorsement);

        /** MessageSlashEndorsement senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageSlashEndorsement endorsementId. */
        public endorsementId: string;

        /** MessageSlashEndorsement reason. */
        public reason: string;

        /**
         * Creates a new MessageSlashEndorsement instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageSlashEndorsement instance
         */
        public static create(properties?: types.IMessageSlashEndorsement): types.MessageSlashEndorsement;

        /**
         * Encodes the specified MessageSlashEndorsement message. Does not implicitly {@link types.MessageSlashEndorsement.verify|verify} messages.
         * @param message MessageSlashEndorsement message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageSlashEndorsement, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageSlashEndorsement message, length delimited. Does not implicitly {@link types.MessageSlashEndorsement.verify|verify} messages.
         * @param message MessageSlashEndorsement message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageSlashEndorsement, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageSlashEndorsement message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageSlashEndorsement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageSlashEndorsement;

        /**
         * Decodes a MessageSlashEndorsement message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageSlashEndorsement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageSlashEndorsement;

        /**
         * Verifies a MessageSlashEndorsement message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageSlashEndorsement message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageSlashEndorsement
         */
        public static fromObject(object: { [k: string]: any }): types.MessageSlashEndorsement;

        /**
         * Creates a plain object from a MessageSlashEndorsement message. Also converts values to other types if specified.
         * @param message MessageSlashEndorsement
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageSlashEndorsement, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageSlashEndorsement to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageSlashEndorsement
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageClaimRole. */
    interface IMessageClaimRole {

        /** MessageClaimRole senderAddress */
        senderAddress?: (Uint8Array|null);

        /** MessageClaimRole circleId */
        circleId?: (string|null);
    }

    /** Represents a MessageClaimRole. */
    class MessageClaimRole implements IMessageClaimRole {

        /**
         * Constructs a new MessageClaimRole.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageClaimRole);

        /** MessageClaimRole senderAddress. */
        public senderAddress: Uint8Array;

        /** MessageClaimRole circleId. */
        public circleId: string;

        /**
         * Creates a new MessageClaimRole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageClaimRole instance
         */
        public static create(properties?: types.IMessageClaimRole): types.MessageClaimRole;

        /**
         * Encodes the specified MessageClaimRole message. Does not implicitly {@link types.MessageClaimRole.verify|verify} messages.
         * @param message MessageClaimRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageClaimRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageClaimRole message, length delimited. Does not implicitly {@link types.MessageClaimRole.verify|verify} messages.
         * @param message MessageClaimRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageClaimRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageClaimRole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageClaimRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageClaimRole;

        /**
         * Decodes a MessageClaimRole message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageClaimRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageClaimRole;

        /**
         * Verifies a MessageClaimRole message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageClaimRole message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageClaimRole
         */
        public static fromObject(object: { [k: string]: any }): types.MessageClaimRole;

        /**
         * Creates a plain object from a MessageClaimRole message. Also converts values to other types if specified.
         * @param message MessageClaimRole
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageClaimRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageClaimRole to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageClaimRole
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Profile. */
    interface IProfile {

        /** Profile address */
        address?: (Uint8Array|null);

        /** Profile username */
        username?: (string|null);

        /** Profile bio */
        bio?: (string|null);

        /** Profile avatarUrl */
        avatarUrl?: (string|null);

        /** Profile reputation */
        reputation?: (number|Long|null);
    }

    /** Represents a Profile. */
    class Profile implements IProfile {

        /**
         * Constructs a new Profile.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IProfile);

        /** Profile address. */
        public address: Uint8Array;

        /** Profile username. */
        public username: string;

        /** Profile bio. */
        public bio: string;

        /** Profile avatarUrl. */
        public avatarUrl: string;

        /** Profile reputation. */
        public reputation: (number|Long);

        /**
         * Creates a new Profile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Profile instance
         */
        public static create(properties?: types.IProfile): types.Profile;

        /**
         * Encodes the specified Profile message. Does not implicitly {@link types.Profile.verify|verify} messages.
         * @param message Profile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Profile message, length delimited. Does not implicitly {@link types.Profile.verify|verify} messages.
         * @param message Profile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Profile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Profile;

        /**
         * Decodes a Profile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Profile;

        /**
         * Verifies a Profile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Profile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Profile
         */
        public static fromObject(object: { [k: string]: any }): types.Profile;

        /**
         * Creates a plain object from a Profile message. Also converts values to other types if specified.
         * @param message Profile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Profile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Profile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Profile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Circle. */
    interface ICircle {

        /** Circle circleId */
        circleId?: (string|null);

        /** Circle name */
        name?: (string|null);

        /** Circle description */
        description?: (string|null);

        /** Circle creatorAddress */
        creatorAddress?: (Uint8Array|null);

        /** Circle members */
        members?: (Uint8Array[]|null);
    }

    /** Represents a Circle. */
    class Circle implements ICircle {

        /**
         * Constructs a new Circle.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.ICircle);

        /** Circle circleId. */
        public circleId: string;

        /** Circle name. */
        public name: string;

        /** Circle description. */
        public description: string;

        /** Circle creatorAddress. */
        public creatorAddress: Uint8Array;

        /** Circle members. */
        public members: Uint8Array[];

        /**
         * Creates a new Circle instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Circle instance
         */
        public static create(properties?: types.ICircle): types.Circle;

        /**
         * Encodes the specified Circle message. Does not implicitly {@link types.Circle.verify|verify} messages.
         * @param message Circle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.ICircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Circle message, length delimited. Does not implicitly {@link types.Circle.verify|verify} messages.
         * @param message Circle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.ICircle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Circle message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Circle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Circle;

        /**
         * Decodes a Circle message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Circle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Circle;

        /**
         * Verifies a Circle message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Circle message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Circle
         */
        public static fromObject(object: { [k: string]: any }): types.Circle;

        /**
         * Creates a plain object from a Circle message. Also converts values to other types if specified.
         * @param message Circle
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Circle, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Circle to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Circle
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Endorsement. */
    interface IEndorsement {

        /** Endorsement endorsementId */
        endorsementId?: (string|null);

        /** Endorsement circleId */
        circleId?: (string|null);

        /** Endorsement fromAddress */
        fromAddress?: (Uint8Array|null);

        /** Endorsement targetAddress */
        targetAddress?: (Uint8Array|null);

        /** Endorsement tag */
        tag?: (string|null);

        /** Endorsement message */
        message?: (string|null);

        /** Endorsement slashed */
        slashed?: (boolean|null);

        /** Endorsement slashReason */
        slashReason?: (string|null);

        /** Endorsement contributionId */
        contributionId?: (string|null);
    }

    /** Represents an Endorsement. */
    class Endorsement implements IEndorsement {

        /**
         * Constructs a new Endorsement.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IEndorsement);

        /** Endorsement endorsementId. */
        public endorsementId: string;

        /** Endorsement circleId. */
        public circleId: string;

        /** Endorsement fromAddress. */
        public fromAddress: Uint8Array;

        /** Endorsement targetAddress. */
        public targetAddress: Uint8Array;

        /** Endorsement tag. */
        public tag: string;

        /** Endorsement message. */
        public message: string;

        /** Endorsement slashed. */
        public slashed: boolean;

        /** Endorsement slashReason. */
        public slashReason: string;

        /** Endorsement contributionId. */
        public contributionId: string;

        /**
         * Creates a new Endorsement instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Endorsement instance
         */
        public static create(properties?: types.IEndorsement): types.Endorsement;

        /**
         * Encodes the specified Endorsement message. Does not implicitly {@link types.Endorsement.verify|verify} messages.
         * @param message Endorsement message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IEndorsement, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Endorsement message, length delimited. Does not implicitly {@link types.Endorsement.verify|verify} messages.
         * @param message Endorsement message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IEndorsement, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Endorsement message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Endorsement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Endorsement;

        /**
         * Decodes an Endorsement message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Endorsement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Endorsement;

        /**
         * Verifies an Endorsement message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Endorsement message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Endorsement
         */
        public static fromObject(object: { [k: string]: any }): types.Endorsement;

        /**
         * Creates a plain object from an Endorsement message. Also converts values to other types if specified.
         * @param message Endorsement
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Endorsement, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Endorsement to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Endorsement
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Contribution. */
    interface IContribution {

        /** Contribution contributionId */
        contributionId?: (string|null);

        /** Contribution circleId */
        circleId?: (string|null);

        /** Contribution authorAddress */
        authorAddress?: (Uint8Array|null);

        /** Contribution title */
        title?: (string|null);

        /** Contribution description */
        description?: (string|null);

        /** Contribution proofUrl */
        proofUrl?: (string|null);

        /** Contribution category */
        category?: (string|null);

        /** Contribution endorsementCount */
        endorsementCount?: (number|Long|null);

        /** Contribution slashed */
        slashed?: (boolean|null);
    }

    /** Represents a Contribution. */
    class Contribution implements IContribution {

        /**
         * Constructs a new Contribution.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IContribution);

        /** Contribution contributionId. */
        public contributionId: string;

        /** Contribution circleId. */
        public circleId: string;

        /** Contribution authorAddress. */
        public authorAddress: Uint8Array;

        /** Contribution title. */
        public title: string;

        /** Contribution description. */
        public description: string;

        /** Contribution proofUrl. */
        public proofUrl: string;

        /** Contribution category. */
        public category: string;

        /** Contribution endorsementCount. */
        public endorsementCount: (number|Long);

        /** Contribution slashed. */
        public slashed: boolean;

        /**
         * Creates a new Contribution instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Contribution instance
         */
        public static create(properties?: types.IContribution): types.Contribution;

        /**
         * Encodes the specified Contribution message. Does not implicitly {@link types.Contribution.verify|verify} messages.
         * @param message Contribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Contribution message, length delimited. Does not implicitly {@link types.Contribution.verify|verify} messages.
         * @param message Contribution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IContribution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Contribution message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Contribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Contribution;

        /**
         * Decodes a Contribution message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Contribution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Contribution;

        /**
         * Verifies a Contribution message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Contribution message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Contribution
         */
        public static fromObject(object: { [k: string]: any }): types.Contribution;

        /**
         * Creates a plain object from a Contribution message. Also converts values to other types if specified.
         * @param message Contribution
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Contribution, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Contribution to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Contribution
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Role. */
    interface IRole {

        /** Role circleId */
        circleId?: (string|null);

        /** Role address */
        address?: (Uint8Array|null);

        /** Role role */
        role?: (string|null);

        /** Role reputation */
        reputation?: (number|Long|null);
    }

    /** Represents a Role. */
    class Role implements IRole {

        /**
         * Constructs a new Role.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IRole);

        /** Role circleId. */
        public circleId: string;

        /** Role address. */
        public address: Uint8Array;

        /** Role role. */
        public role: string;

        /** Role reputation. */
        public reputation: (number|Long);

        /**
         * Creates a new Role instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Role instance
         */
        public static create(properties?: types.IRole): types.Role;

        /**
         * Encodes the specified Role message. Does not implicitly {@link types.Role.verify|verify} messages.
         * @param message Role message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Role message, length delimited. Does not implicitly {@link types.Role.verify|verify} messages.
         * @param message Role message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Role message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Role
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Role;

        /**
         * Decodes a Role message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Role
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Role;

        /**
         * Verifies a Role message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Role message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Role
         */
        public static fromObject(object: { [k: string]: any }): types.Role;

        /**
         * Creates a plain object from a Role message. Also converts values to other types if specified.
         * @param message Role
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Role, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Role to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Role
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FeeParams. */
    interface IFeeParams {

        /** FeeParams sendFee */
        sendFee?: (number|Long|null);
    }

    /** Represents a FeeParams. */
    class FeeParams implements IFeeParams {

        /**
         * Constructs a new FeeParams.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IFeeParams);

        /** FeeParams sendFee. */
        public sendFee: (number|Long);

        /**
         * Creates a new FeeParams instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FeeParams instance
         */
        public static create(properties?: types.IFeeParams): types.FeeParams;

        /**
         * Encodes the specified FeeParams message. Does not implicitly {@link types.FeeParams.verify|verify} messages.
         * @param message FeeParams message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IFeeParams, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FeeParams message, length delimited. Does not implicitly {@link types.FeeParams.verify|verify} messages.
         * @param message FeeParams message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IFeeParams, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FeeParams message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FeeParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.FeeParams;

        /**
         * Decodes a FeeParams message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FeeParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.FeeParams;

        /**
         * Verifies a FeeParams message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FeeParams message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FeeParams
         */
        public static fromObject(object: { [k: string]: any }): types.FeeParams;

        /**
         * Creates a plain object from a FeeParams message. Also converts values to other types if specified.
         * @param message FeeParams
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.FeeParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FeeParams to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FeeParams
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Signature. */
    interface ISignature {

        /** Signature publicKey */
        publicKey?: (Uint8Array|null);

        /** Signature signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a Signature. */
    class Signature implements ISignature {

        /**
         * Constructs a new Signature.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.ISignature);

        /** Signature publicKey. */
        public publicKey: Uint8Array;

        /** Signature signature. */
        public signature: Uint8Array;

        /**
         * Creates a new Signature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Signature instance
         */
        public static create(properties?: types.ISignature): types.Signature;

        /**
         * Encodes the specified Signature message. Does not implicitly {@link types.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Signature message, length delimited. Does not implicitly {@link types.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Signature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Signature;

        /**
         * Decodes a Signature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Signature;

        /**
         * Verifies a Signature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Signature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Signature
         */
        public static fromObject(object: { [k: string]: any }): types.Signature;

        /**
         * Creates a plain object from a Signature message. Also converts values to other types if specified.
         * @param message Signature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Signature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Signature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Signature
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Any
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
