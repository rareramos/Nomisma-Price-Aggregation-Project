import React from 'react';
import { Readable } from 'stream';

export interface ICfdFindFilter {
  symbol : string;
}

export interface IQuasiFilter {
  serviceName ? : string;
  symbol ? : string;
}

export interface IQausiLiveProperties {
  _id ? : string;
  nomismaSymbol ? : string;
  serviceSymbol ? : string;
  symbolScraping ? : string;
  serviceName : string;
  symbol : string;
  base : string;
  classification : string;
  contract : string;
  fundingLong : number;
  fundingShort : number;
  makerFee : number;
  margin : number;
  marginCcy : string;
  name : string;
  takerFee : number;
  underlying : string;
  expiry : string;
  bid : number;
  offer : number;
}

export interface IQuasiLiveObject {
  [key : string] : Array<Array<IQausiLiveProperties> | IQausiLiveProperties>;
}

export interface IQuasiLiveData {
  [key : string] : IQuasiLiveObject;
}

export interface IQuasiInstrumentsObject {
  [key : string] : IQausiLiveProperties;
}

export interface IQuasiInstruments {
  [key : string] : IQuasiInstrumentsObject;
}

export interface ISummary {
  serviceName : string;
  status : boolean;
  matched : number;
  unmatched : number;
  combinedData : Array<IQausiLiveProperties>;
  unmatchedApiData : Array<IQausiLiveProperties>;
  unmatchedScrapingData : Array<IQausiLiveProperties>;
  countApiInstruments ? : number;
  countScrapingInstuments ? : number;
}

export interface IReportParams {
  timestamp : string;
  summary : Array<ISummary>;
}

export interface IMailSender {
  timestamp ? : string;
  summary ? : Array<ISummary>;
  sender ? : IRenderMailer;
  recipient ? : IRecipientDefaultLayout;
  children ? : JSX.Element;
}

export interface IRenderMailer {
  company : IMailer;
}

export interface IRecipientDefaultLayout {
  _id : string;
  name : string;
}

export interface IDeafultLayout {
  timestamp ? : string;
  summary ? : Array<ISummary>;
  children : JSX.Element;
  sender : ISenderDefaultLayout;
  recipient : IRecipientDefaultLayout;
}

export interface ISenderObjectLayout {
  website : string;
  name : string;
  logo : string;
  footerLinks : Array<IFooterlinks>;
}

export interface ISenderDefaultLayout {
  company : ISenderObjectLayout;
}

export interface IFooterlinks {
  title : string;
  url : string;
}

export interface IMailer {
  name : string;
  email : string;
  website : string;
  logo : string;
  footerLinks : Array<IFooterlinks>;
}


interface IHeadersPrepareValue {
  prepared : boolean;
  value : string;
}

interface IHeadersKeyValue {
  key : string;
  value : string;
}

interface IHeaders {
  [key : string] : string | Array<string> | IHeadersPrepareValue;
}

interface IAttachmentLike {
  content ?: string | Buffer | Readable;
  path ?: string;
}

interface IAttachment extends IAttachmentLike{
  filename ?: string | false;
  cid ?: string;
  encoding ?: string;
  contentType ?: string;
  contentTransferEncoding ?: '7bit' | 'base64' | 'quoted-printable' | false;
  contentDisposition ?: 'attachment' | 'inline';
  headers ?: IHeaders | Array<IHeadersKeyValue>;
  raw ?: string | Buffer | Readable | IAttachmentLike;
}

export interface ISendMessage {
  to ? : string;
  cc ? : string;
  bcc ? : string;
  subject : string;
  template : React.FunctionComponent<IMailSender>;
  attachments ? : Array<IAttachment>;
}

export interface IExpiryDatesMappingProperties {
  _id : string;
  contract : string;
  expiry : string;
  original : string;
}

export interface IExpiryDatesMapping {
  [key : string] : IExpiryDatesMappingProperties;
}
