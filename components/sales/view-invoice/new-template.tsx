import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProjectItem {
  description: string;
  details: string;
  hours: number;
  rate: number;
  subtotal: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  issueDate: string;
  client: {
    name: string;
    social: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      phone: string;
    };
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      phone: string;
    };
  };
  projects: ProjectItem[];
  subTotal: number;
  taxRate: number;
  total: number;
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({
  invoiceNumber,
  issueDate,
  client,
  projects,
  subTotal,
  taxRate,
  total,
}) => {
  return (
    <Card className='mx-auto w-full max-w-4xl p-8'>
      <CardContent>
        {/* Header */}
        <div className='mb-8 flex justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Invoice: #{invoiceNumber}</h1>
            <p className='text-gray-500'>Issue Date: {issueDate}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold'>Invoice to</h2>

          <div>
            <h3 className='mb-2 font-semibold'>{client.name}</h3>
            <p className='mb-4 text-gray-500'>{client.social}</p>
            <div className='space-y-1'>
              <p className='font-medium'>Billed To:</p>
              <p>{client.billingAddress.street}</p>
              <p>{`${client.billingAddress.city}, ${client.billingAddress.state} ${client.billingAddress.zip}`}</p>
              <p>P: {client.billingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Project Breakdown */}
        <div className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold'>Project Breakdown</h2>
          <div className='w-full overflow-auto'>
            <table className='w-full border-collapse border border-dashed'>
              <thead>
                <tr className='border-b border-dashed'>
                  <th className='px-4 py-4 text-left font-medium'>Project</th>
                  <th className='px-4 py-4 text-left font-medium'>Hours</th>
                  <th className='px-4 py-4 text-left font-medium'>Rate</th>
                  <th className='px-4 py-4 text-right font-medium'>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index} className='border-b border-dashed'>
                    <td className='px-4 py-4 align-top'>
                      <div>
                        <p className='font-medium'>{project.description}</p>
                        <p className='mt-1 text-sm text-gray-500'>
                          {project.details}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 py-4'>{project.hours}</td>
                    <td className='px-4 py-4'>${project.rate}</td>
                    <td className='px-4 py-4 text-right'>
                      ${project.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='font-medium'>Sub Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Tax Rate</span>
            <span>{taxRate}%</span>
          </div>
          <Separator className='my-4' />
          <div className='flex justify-between'>
            <span className='font-bold'>Total</span>
            <span className='font-bold'>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className='mt-8'>
          <h2 className='mb-4 text-xl font-semibold'>Terms And Conditions:</h2>
          <ul className='list-disc space-y-2 pl-5 text-gray-600'>
            <li>
              All accounts are to be paid within 7 days from receipt of invoice.
            </li>
            <li>
              To be paid by cheque or credit card or direct payment online.
            </li>
            <li>
              If account is not paid within 7 days the credits details supplied
              as confirmation of work undertaken will be charged the agreed
              quoted fee noted above.
            </li>
          </ul>
        </div>

        {/* Signature */}
        <div className='mt-8'>
          <p className='font-medium'>Account Manager</p>
          <div className='mt-4 w-48 border-t border-gray-200'>
            <p className='mt-2'>Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-gray-500'>
          <p>Thank you very much for doing business with us.</p>
        </div>
      </CardContent>
    </Card>
    // <Card className='mx-auto w-full max-w-4xl p-8'>
    //   <CardContent>
    //     {/* Header */}
    //     <div className='mb-8 flex justify-between'>
    //       <div>
    //         <h1 className='text-2xl font-bold'>Invoice: #{invoiceNumber}</h1>
    //         <p className='text-gray-500'>Issue Date: {issueDate}</p>
    //       </div>
    //     </div>

    //     {/* Client Info */}
    //     <div className='mb-8'>
    //       <h2 className='mb-4 text-xl font-semibold'>Invoice to</h2>
    //       <div className='grid grid-cols-2 gap-8'>
    //         <div>
    //           <h3 className='mb-2 font-semibold'>{client.name}</h3>
    //           <p className='mb-4 text-gray-500'>{client.social}</p>
    //           <div className='space-y-1'>
    //             <p className='font-medium'>Billed To:</p>
    //             <p>{client.billingAddress.street}</p>
    //             <p>{`${client.billingAddress.city}, ${client.billingAddress.state} ${client.billingAddress.zip}`}</p>
    //             <p>P: {client.billingAddress.phone}</p>
    //           </div>
    //         </div>
    //         <div>
    //           <div className='space-y-1'>
    //             <p className='font-medium'>Shipped To:</p>
    //             <p>{client.shippingAddress.street}</p>
    //             <p>{`${client.shippingAddress.city}, ${client.shippingAddress.state} ${client.shippingAddress.zip}`}</p>
    //             <p>P: {client.shippingAddress.phone}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Project Breakdown */}
    //     <div className='mb-8'>
    //       <h2 className='mb-4 text-xl font-semibold'>Project Breakdown</h2>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>Project</TableHead>
    //             <TableHead>Hours</TableHead>
    //             <TableHead>Rate</TableHead>
    //             <TableHead className='text-right'>Subtotal</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {projects.map((project, index) => (
    //             <TableRow key={index}>
    //               <TableCell className='align-top'>
    //                 <div>
    //                   <p className='font-medium'>{project.description}</p>
    //                   <p className='mt-1 text-sm text-gray-500'>
    //                     {project.details}
    //                   </p>
    //                 </div>
    //               </TableCell>
    //               <TableCell>{project.hours}</TableCell>
    //               <TableCell>${project.rate}</TableCell>
    //               <TableCell className='text-right'>
    //                 ${project.subtotal.toFixed(2)}
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </div>

    //     {/* Totals */}
    //     <div className='space-y-2'>
    //       <div className='flex justify-between'>
    //         <span className='font-medium'>Sub Total</span>
    //         <span>${subTotal.toFixed(2)}</span>
    //       </div>
    //       <div className='flex justify-between'>
    //         <span className='font-medium'>Tax Rate</span>
    //         <span>{taxRate}%</span>
    //       </div>
    //       <Separator className='my-4' />
    //       <div className='flex justify-between'>
    //         <span className='font-bold'>Total</span>
    //         <span className='font-bold'>${total.toFixed(2)}</span>
    //       </div>
    //     </div>

    //     {/* Terms and Conditions */}
    //     <div className='mt-8'>
    //       <h2 className='mb-4 text-xl font-semibold'>Terms And Conditions:</h2>
    //       <ul className='list-disc space-y-2 pl-5 text-gray-600'>
    //         <li>
    //           All accounts are to be paid within 7 days from receipt of invoice.
    //         </li>
    //         <li>
    //           To be paid by cheque or credit card or direct payment online.
    //         </li>
    //         <li>
    //           If account is not paid within 7 days the credits details supplied
    //           as confirmation of work undertaken will be charged the agreed
    //           quoted fee noted above.
    //         </li>
    //       </ul>
    //     </div>

    //     {/* Signature */}
    //     <div className='mt-8'>
    //       <p className='font-medium'>Account Manager</p>
    //       <div className='mt-4 w-48 border-t border-gray-200'>
    //         <p className='mt-2'>Signature</p>
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className='mt-8 text-center text-gray-500'>
    //       <p>Thank you very much for doing business with us.</p>
    //     </div>
    //   </CardContent>
    // </Card>
  );
};

export default InvoiceTemplate;
