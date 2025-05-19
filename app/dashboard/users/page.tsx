import { ViewIcon } from 'lucide-react';

import Link from '@/components/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Map from '../../../components/GoogleMap';
import { getUsers } from './action/actions';
import EditUser from './component/EditUser';

export default async function UserManagement() {
  const users = await getUsers();
  return (
    <div className='p-</div>4'>
      <h1 className='mb-4 text-2xl font-bold'>إدارة المستخدمين</h1>
      {/* جدول المستخدمين */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-right'>الجوال</TableHead>
            <TableHead className='text-right'>الاسم</TableHead>
            <TableHead className='text-right'>الإيميل</TableHead>
            <TableHead className='text-right'>النوع</TableHead>
            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className='flex items-center justify-end gap-3'>
                <Link href={`/dashboard/users/viewuser?id=${user.id}`}>
                  <ViewIcon />
                </Link>

                <EditUser userId={user.id} />
                <Map latitude={parseFloat(user.latitude)} longitude={parseFloat(user.longitude)} />
                {/* <TomTomMap
                  latitude={25.1972}
                  longitude={55.2744}
                  placeName="Burj Khalifa"
                /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
