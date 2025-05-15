
import Image from 'next/image';
import dottedface from '@/media/headshot_neutral_lips_512x512.webp';

export default function DottedFace(props: any) {
    return (
    
        <div className="flex justify-center items-center">
           <Image 
                src={dottedface} 
                alt="loading..." 
                width={350}
                height={350}
            />
        </div>
    );
}