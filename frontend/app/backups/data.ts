const columns = [
  { name: 'name', uid: 'name' },
  { name: 'receiver', uid: 'receiver' },
  { name: 'value', uid: 'value' },
  { name: 'initiation Date', uid: 'date' },
  { name: 'actions', uid: 'actions' },
];

const users = [
  {
    id: 1,
    name: 'Preventing risks on trip to EthCC',
    receiver: '00xa9....ab4bd',
    value: '75%',
    date: '13 Jul 2024',
  },
  {
    id: 2,
    name: 'If lost while climbing on Everest',
    receiver: '00xa9....ab432',
    value: '50%',
    date: '27 Oct 2024',
  },
  {
    id: 3,
    name: 'In case of a racetrack accident',
    receiver: '00aa9....ab4d1',
    value: '51,8.6 ETH',
    date: '17 Nov 2024',
  },
  {
    id: 4,
    name: 'Digital inheritance',
    receiver: ['00xa9....ab1d7', '00xa9....ab3d4', '00xa9....ab2d5'],
    value: ['15%', '40%', '45%'],
    date: '01 Jan 2025',
  },
  {
    id: 5,
    name: 'Heart surgery, June 2025',
    receiver: '00xa9....ab42a',
    value: '100%',
    date: '31 June 2025',
  },
];

export { columns, users };
