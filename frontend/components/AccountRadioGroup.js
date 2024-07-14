import React from "react";
import {RadioGroup, Radio, cn} from "@nextui-org/react";

export default function AccountRadioGroup({safes, onChange}) {

	console.log('account radio', safes);

	return (
		<RadioGroup
				label="Accounts"
				description="Select Safe to use"
				onValueChange={onChange}
		>
			{
				safes.map((safe) => {
					const isCompatible = safe.version === '1.4.1';
					const description = !isCompatible ? 'Can\'t be used' : '';
					return (
						<CustomRadio value={safe.address} disabled={!isCompatible} description={description}>
							{safe.address}
						</CustomRadio>
					)
				})
			}
			</RadioGroup>
	);
}


export const CustomRadio = (props) => {
	const {children, ...otherProps} = props;

	return (
			<Radio
					{...otherProps}
					classNames={{
						base: cn(
								"inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
								"flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
								"data-[selected=true]:border-primary"
						),
					}}
			>
				{children}
			</Radio>
	);
};
