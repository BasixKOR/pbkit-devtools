import { atom, PrimitiveAtom } from "jotai";
import type Events from "../../../Events";

interface GetRequestKeyConfig {
  configId: string;
  requestId: number;
}
export const getRequestKey = ({ configId, requestId }: GetRequestKeyConfig) => {
  return configId + "\0" + requestId;
};

export const requestsAtom = atom<Requests>({});

export const updateRequestAtom = atom<null, Events["request"]>(
  null,
  (get, set, update) => {
    const requests = get(requestsAtom);
    const request: Request = {
      ...update,
      requestPayloadsAtom: atom<RequestPayload[]>([]),
      headerJson: undefined,
      trailerJson: undefined,
      responsePayloadsAtom: atom<ResponsePayload[]>([]),
    };
    set(requestsAtom, {
      ...requests,
      [getRequestKey(update)]: atom(request),
    });
  }
);

export const updateRequestPayloadAtom = atom<null, Events["request-payload"]>(
  null,
  (get, set, update) => {
    const requests = get(requestsAtom);
    const request = get(requests[getRequestKey(update)]);
    const requestPayloads = get(request.requestPayloadsAtom);
    set(request.requestPayloadsAtom, [...requestPayloads, update]);
  }
);

export const updateResponseAtom = atom<null, Events["response"]>(
  null,
  (get, set, update) => {
    const requests = get(requestsAtom);
    const requestAtom = requests[getRequestKey(update)];
    set(requestAtom, { ...get(requestAtom), ...update });
  }
);

export const updateResponsePayloadAtom = atom<null, Events["response-payload"]>(
  null,
  (get, set, update) => {
    const requests = get(requestsAtom);
    const request = get(requests[getRequestKey(update)]);
    const responsePayloads = get(request.responsePayloadsAtom);
    set(request.responsePayloadsAtom, [...responsePayloads, update]);
  }
);

export const updateResponseTrailerAtom = atom<null, Events["response-trailer"]>(
  null,
  (get, set, update) => {
    const requests = get(requestsAtom);
    const requestAtom = requests[getRequestKey(update)];
    set(requestAtom, { ...get(requestAtom), ...update });
  }
);

export interface Requests {
  [key: string]: PrimitiveAtom<Request>;
}

export interface Request {
  servicePath: string;
  rpcName: string;
  metadataJson: string;
  tags: string[];
  requestPayloadsAtom: PrimitiveAtom<RequestPayload[]>;
  headerJson: string | undefined;
  trailerJson: string | undefined;
  responsePayloadsAtom: PrimitiveAtom<ResponsePayload[]>;
}

export interface RequestPayload {
  payloadJson: string;
  payloadProto: Uint8Array;
}

export interface ResponsePayload {
  payloadJson: string;
  payloadProto: Uint8Array;
}
