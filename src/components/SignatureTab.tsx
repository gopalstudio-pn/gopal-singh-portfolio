export default function SignatureTab({ name }: { name: string }) {
  return <p className="py-16 text-center text-xs tracking-[0.3em] text-white/40">SIGNATURE MAKER COMES IN THE NEXT STEP {name ? '' : ''}</p>;
}
